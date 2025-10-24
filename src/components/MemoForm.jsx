import React, { useState } from 'react';
import api from '../services/api';
import { TextField, Button, Grid, Typography } from '@mui/material';

function MemoForm({ onMemoAdded }) {
  const [formData, setFormData] = useState({
    date_signed: '',
    sender: '',
    subject: '',
    amount: '',
    recipient_office: '',
    memoImage:''
  });
  const [file, setFile] = useState(null);

  const formatAmount = (value) => {
    const numeric = value.replace(/[^\d]/g, '');
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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

      if (file) {
        data.append('memoImage', file); // backend should handle file upload
      }
      try {
       const res = await api.post('http://localhost:5000/api/memos', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
         });
      onMemoAdded(res.data);
      } catch (error) {
        console.log("unable bto add:", error )
      }   

      setFormData({ sender: '', subject: '', amount: '', recipient_office: '', imageUrl: '' });
      setFile(null);
    } catch (err) {
      console.error('Error saving memo:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} sx={{ mt: 1 }}>
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


        {/* File Upload */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">Upload Image</Typography>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </Grid>

        <Grid item xs={12} textAlign="right">
          <Button type="submit" variant="contained" color="success">
            Save Memo
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default MemoForm;
