import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Login";
import Sidebar from "../components/Sidebar";
import ThreatDetection from "../pages/ThreatDetection";
import ThreatHistory from "../pages/ThreatHistory";

// Simple Layout Wrapper
const DashboardLayout = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <main className="ml-64 p-8 w-full bg-slate-50 min-h-screen">
      {children}
    </main>
  </div>
);

const Dashboard = () => (
  <DashboardLayout>
    <h2 className="text-3xl font-bold mb-6">Security Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
        <p className="text-slate-500">Total Threats</p>
        <h3 className="text-2xl font-bold">1,284</h3>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
        <p className="text-slate-500">Active Attacks</p>
        <h3 className="text-2xl font-bold text-red-600">12</h3>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
        <p className="text-slate-500">Safe Activities</p>
        <h3 className="text-2xl font-bold text-green-600">99.2%</h3>
      </div>
    </div>
  </DashboardLayout>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/detect" element={<ThreatDetection />} />
        <Route path="/history" element={<ThreatHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
