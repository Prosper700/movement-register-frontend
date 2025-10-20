import React, { useEffect, useState } from 'react';
import api from '../services/api';

function MemoTable() {
  const [memos, setMemos] = useState([]);

  useEffect(() => {
    api.get('/api/memos')
      .then(res => setMemos(res.data))
      .catch(err => console.error('Error fetching memos:', err));
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Movement Register</h1>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>From</th>
            <th>Subject</th>
            <th>Amount</th>
            <th>Sent To</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {memos.map(memo => (
            <tr key={memo.id}>
              <td>{new Date(memo.date_sent).toLocaleString()}</td>
              <td>{memo.sender}</td>
              <td>{memo.subject}</td>
              <td>{memo.amount || '—'}</td>
              <td>{memo.recipient_office}</td>
              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MemoTable;
