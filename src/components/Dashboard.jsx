import { useState } from "react";
import MemoTable from "./MemoTable";

export default function Dashboard({ onLogout }) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      {/* ✅ Only MemoTable here, refresh handled locally */}
      <MemoTable key={refreshKey} />
    </div>
  );
}
