import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Toggle from "./components/Header";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Check cookie/session on first load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/check`, {
          credentials: "include", // 👈 send cookie
        });
        const data = await res.json();
        if (data.loggedIn) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', p: 2 }}>
      <header className="header1">
        <h1 className="mb-4">Movement Register</h1>
        <div className="toggleButton">
          <Toggle />
        </div>
      </header>

      {/* ✅ Show login or dashboard depending on auth */}
      {isAuthenticated ? (
        <Dashboard onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </Box>
  );
}

export default App;
