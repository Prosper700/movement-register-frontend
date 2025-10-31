import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MemoForm from './MemoForm';
import MemoImagesCell from "./MemoImagesCell"
import FilteredResultsDialog from './FilteredResultsDialog';


import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton, 
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Button,
  TextField,
  Pagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

function MemoTable() {
  const [memos, setMemos] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMemos, setFilteredMemos] = useState([]);
  const [openPopup, setOpenPopup] = useState(false); 
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0); // 👈 added


  const fetchMemos = () => {
    api.get("/memos")
      .then(res => {
        // ✅ Take only the latest 100 memos
        const latest = res.data
          .sort((a, b) => new Date(b.date_sent) - new Date(a.date_sent))
          .slice(0, 100);
        setMemos(latest);
      })
      .catch(err => console.error('Error fetching memos:', err));
  };

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/memos`, {
          method: "GET",
          credentials: "include", // 👈 ensures session cookie is sent
        });

        if (!res.ok) {
          throw new Error("Failed to fetch memos");
        }

        const data = await res.json();
        setMemos(data);
      } catch (err) {
        console.error("Error fetching memos:", err);
      }
    };

    fetchMemos();
  }, []); // runs once when component mounts

    // ✅ Re-fetch whenever refreshKey changes
  useEffect(() => {
    fetchMemos();
  }, [refreshKey]);

  const handleMemoAdded = () => {
    setOpen(false);
    setRefreshKey((prev) => prev + 1); // 👈 trigger refresh
  };

  // ✅ Pagination logic
  const memosPerPage = 10;
  const totalPages = Math.min(10, Math.ceil(memos.length / memosPerPage));
  const startIndex = (page - 1) * memosPerPage;
  const currentMemos = memos.slice(startIndex, startIndex + memosPerPage);

  function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return ''; // fallback: show nothing if invalid
  }

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
  }).format(value);
}


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


 
  const handleSearch = () => {
   if (!searchQuery.trim()) {
    // prevent search if input is empty
    alert("Please enter a search term before searching.");
    return;
  }
  const results = memos.filter((memo) => {
  const query = searchQuery.toLowerCase();
    return (
      memo.sender.toLowerCase().includes(query) ||
      memo.subject.toLowerCase().includes(query) ||
      memo.recipient_office.toLowerCase().includes(query) ||
      formatDate(memo.date_signed).includes(query)
    );
  });

  setFilteredMemos(results);
  setOpenPopup(true);  // open popup only after button click
  console.log(setFilteredMemos);
};



  return (
    <div>
        <div className='searchButton'>
          <TextField
          label="Search Memos"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: 16, width:"950px"}}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchQuery && (
                <IconButton onClick={() => setSearchQuery('')}>
                  <ClearIcon />
                </IconButton>
                )}
              </InputAdornment>
            )
          }}
          />
          <Button
            variant="contained" 
            color="primary" 
            onClick={handleSearch}   // <-- only runs when clicked
            style={{ marginBottom: 16, width:"20"}}
          >
            Search
          </Button>
        </div>
        <FilteredResultsDialog
          open={openPopup}
          onClose={() => setOpenPopup(false)}
          filteredMemos={filteredMemos}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
        />
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date Signed</TableCell>
              <TableCell>From</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Sent</TableCell>
              <TableCell>Received By</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentMemos.length > 0 ? (
              currentMemos.map(memo => (
                <TableRow key={memo.id}>
                  {/* <TableCell>{new Date(memo.date_sent).toLocaleString()}</TableCell> */}
                  <TableCell>{formatDate(memo.date_signed)}</TableCell>
                  <TableCell>{memo.sender}</TableCell>
                  <TableCell>{memo.subject}</TableCell>
                  <TableCell>{memo.amount && formatCurrency(memo.amount)}</TableCell>
                  <TableCell>{memo.recipient_office}</TableCell>
                  <TableCell>{memo.received_by}</TableCell>
                  <MemoImagesCell memo={memo} />
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No memos found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        

        {/* ✅ Pagination controls */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" p={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Paper><br />
      <a href={`${import.meta.env.VITE_API_URL}/api/memos/export`} className="btn btn-outline-primary mb-3">Export to Excel</a>
      <Button
        variant="outlined"
        color="error"
        onClick={async () => {
          await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
            method: "POST",
            credentials: "include",
          });
          window.location.reload(); // or call a prop like onLogout()
        }}
        sx={{ display: "block", mt: 2 }}
      >
        Logout
      </Button>

      {/* Floating Add Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setOpen(true)}
        style={{ position: 'fixed', bottom: 20, right: 20 }}
      >
        <AddIcon />
      </Fab>

      {/* Dialog with Form */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Memo</DialogTitle>
        <DialogContent>
          <MemoForm onMemoAdded={handleMemoAdded} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MemoTable;
