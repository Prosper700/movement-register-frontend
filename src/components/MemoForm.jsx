import React, { useState } from 'react';
import api from '../services/api';
import { TextField, Button, Grid, Typography, Paper, Box } from '@mui/material';

function MemoForm({ onMemoAdded }) {
  const [formData, setFormData] = useState({
    date_signed: '',
    sender: '',
    subject: '',
    amount: '',
    recipient_office: '',
    received_by: '',
  });
  const [files, setFiles] = useState([]); // multiple files

  const formatAmount = (value) => {
    const numeric = value.replace(/[^\d]/g, '');
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files)); // store all selected files
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('date_signed', formData.date_signed);
      data.append('sender', formData.sender);
      data.append('subject', formData.subject);
      data.append('amount', formData.amount);
      data.append('recipient_office', formData.recipient_office);
      data.append('received_by', formData.received_by);

      // append multiple files
      files.forEach(file => {
        data.append('memoImages', file); // must match backend field name
      });

      const res = await api.post("http://localhost:5000/api/memos", data, {
        withCredentials: true, // 👈 send session cookie
      });

      if (onMemoAdded) onMemoAdded(res.data)

      // reset form
      setFormData({ date_signed: '', sender: '', subject: '', amount: '', recipient_office: '',received_by:'' });
      setFiles([]);
    } catch (err) {
      console.error('Error saving memo:', err);
    }
  };

    return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        {/* Sender */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="From"
            name="sender"
            value={formData.sender}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        {/* Recipient Office */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Recipient Office"
            name="recipient_office"
            value={formData.recipient_office}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        {/* Subject */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        {/* Amount */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Amount (₦)"
            name="amount"
            value={formData.amount}
            onChange={(e) => {
              const formatted = formatAmount(e.target.value);
              setFormData({ ...formData, amount: formatted });
            }}
            fullWidth
          />
        </Grid>

        {/* Date Signed */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Date Signed"
            name="date_signed"
            type="date"
            value={formData.date_signed}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>

        {/* Received By */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Received By"
            name="received_by"
            value={formData.received_by}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        {/* File Upload */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Upload Images
          </Typography>
          <Button variant="outlined" component="label">
            Choose Files
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {files.length > 0 && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {files.length} file(s) selected
            </Typography>
          )}
        </Grid>

        {/* Submit */}
        <Grid item xs={12} textAlign="right">
          <Button type="submit" variant="contained" color="success">
            Save Memo
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemoForm;
