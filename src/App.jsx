import React, { useState } from 'react';
import MemoForm from './components/MemoForm';
import MemoTable from './components/MemoTable';
import Toggle from "./components/Header"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Box } from '@mui/material';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
    const handleMemoAdded = () => {
    setRefreshKey(old => old + 1);
  }

  return (
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', p: 2 }}>
        <header className="header1">
        <h1 className="mb-4">Movement Register</h1>
        <div className='toggleButton'>
          < Toggle />
        </div>
        </header>
        <MemoTable key={refreshKey} />
      </Box>
  );
}

export default App;
