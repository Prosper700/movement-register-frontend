import React, { useState } from 'react';
import MemoForm from './components/MemoForm';
import MemoTable from './components/MemoTable';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
    const handleMemoAdded = () => {
    setRefreshKey(old => old + 1);
  }

  return (
    <div className="container">
      <h1 className="mb-4">Movement Register</h1>
      <MemoTable key={refreshKey} />
    </div>
  );
}

export default App;
