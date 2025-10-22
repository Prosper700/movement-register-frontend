import React, { useState, useRef } from 'react';
import api from '../services/api';

function MemoForm({ onMemoAdded }) {
  const [formData, setFormData] = useState({
    sender: '',
    subject: '',
    amount: '',
    recipient_office: '',
    memoImage: null,
  });

  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('sender', formData.sender);
    data.append('subject', formData.subject);
    data.append('amount', formData.amount);
    data.append('recipient_office', formData.recipient_office);
    if (formData.memoImage) data.append('memoImage', formData.memoImage);

    try {
      const res = await api.post('/memos', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onMemoAdded(res.data); // update table
      
      setFormData({ sender: '', subject: '', amount: '', recipient_office: '', image: null });
      fileInputRef.current.value = ''; // clear file input
    } catch (err) {
      console.error('Error saving memo:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input type="text" name="sender" placeholder="Sender" value={formData.sender} onChange={handleChange} required className="form-control mb-2" />
      <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required className="form-control mb-2" />
      <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} className="form-control mb-2" />
      <input type="text" name="recipient_office" placeholder="Recipient Office" value={formData.recipient_office} onChange={handleChange} required className="form-control mb-2" />
      <input type="file" name="memoImage" onChange={handleChange} className="form-control mb-2" />
      <button type="submit" className="btn btn-success">Save Memo</button>
    </form>
  );
}

export default MemoForm;
