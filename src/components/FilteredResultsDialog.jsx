import React from 'react';
import MemoImagesCell from './MemoImagesCell'; 
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';


export default function FilteredResultsDialog({ open, onClose, filteredMemos, formatDate, formatCurrency }) {
  return (
    <Dialog 
      open={open} onClose={onClose}
      fullWidth maxWidth="md">
      <DialogTitle>Filtered Results</DialogTitle>
      <DialogContent>
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
        {filteredMemos.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sender</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Recipient Office</TableCell>
                <TableCell>Date Signed</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMemos.map((memo) => (
                <TableRow key={memo.id}>
                  <TableCell>{memo.sender}</TableCell>
                  <TableCell>{memo.subject}</TableCell>
                  <TableCell>{memo.recipient_office}</TableCell>
                  <TableCell>{formatDate(memo.date_signed)}</TableCell>
                  <TableCell>{formatCurrency(memo.amount)}</TableCell>
                  <MemoImagesCell memo={memo} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
         ) : (
           <p>No results found.</p>
         )}
         </Box>
      </DialogContent>
    </Dialog>
  );
}
