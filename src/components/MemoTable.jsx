import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MemoForm from './MemoForm';

import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Pagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function MemoTable() {
  const [memos, setMemos] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const fetchMemos = () => {
    api.get('http://localhost:5000/api/memos')
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
    fetchMemos();
  }, []);

  const handleMemoAdded = () => {
    setOpen(false);
    fetchMemos();
  };

  // ✅ Pagination logic
  const memosPerPage = 10;
  const totalPages = Math.min(10, Math.ceil(memos.length / memosPerPage));
  const startIndex = (page - 1) * memosPerPage;
  const currentMemos = memos.slice(startIndex, startIndex + memosPerPage);

  const formatCurrency = (value) => {
    const number = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
    if (isNaN(number)) return '';
    return `₦${number.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


  return (
    <div>
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date Sent</TableCell>
              <TableCell>Date Signed</TableCell>
              <TableCell>From</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Sent</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentMemos.length > 0 ? (
              currentMemos.map(memo => (
                <TableRow key={memo.id}>
                  <TableCell>{new Date(memo.date_sent).toLocaleString()}</TableCell>
                  <TableCell>{formatDate(memo.date_signed)}</TableCell>
                  <TableCell>{memo.sender}</TableCell>
                  <TableCell>{memo.subject}</TableCell>
                  <TableCell>{memo.amount && formatCurrency(memo.amount)}</TableCell>
                  <TableCell>{memo.recipient_office}</TableCell>
                  <TableCell>
                    {memo.image_url ? (
                      <a
                      href={`http://localhost:5000${memo.image_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                      >
                        View
                      </a>
                    ) : '—'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
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
      <a href="/api/memos/export" className="btn btn-outline-primary mb-3">Export to Excel</a>

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
