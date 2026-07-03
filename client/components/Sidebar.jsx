import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldAlert,
  Upload,
  History,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col p-6 fixed left-0 top-0">
      <h1 className="text-xl font-bold mb-10 flex items-center gap-2">
        <ShieldAlert className="text-blue-400" /> ThreatDetect AI
      </h1>

      <nav className="flex-1 space-y-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded"
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link
          to="/detect"
          className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded"
        >
          <Upload size={20} /> New Analysis
        </Link>
        <Link
          to="/history"
          className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded"
        >
          <History size={20} /> Threat History
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-2 text-red-400 hover:bg-slate-800 rounded mt-auto"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
