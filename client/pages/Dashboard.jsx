import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import ThreatChart from "../components/ThreatChart";
import io from "socket.io-client";
import { Shield, AlertCircle, Activity, Lock, List } from "lucide-react";

const Dashboard = () => {
  // Stats state to track real-time numbers
  const [stats, setStats] = useState({
    total: 0,
    highSeverity: 0,
    safeActivities: "99.2%",
  });
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    // 1. Initial Data Fetching
    const fetchData = async () => {
      try {
        const statsRes = await api.get("/threats/stats");
        const historyRes = await api.get("/threats/history");
        setStats(statsRes.data);
        setThreats(historyRes.data);
      } catch (err) {
        console.error("Data fetch error", err);
      }
    };
    fetchData();

    // 2. Setup Real-time Listeners
    const socket = io("http://localhost:5000");

    socket.on("new_threat", (newThreat) => {
      // Add to threat list
      setThreats((prev) => [newThreat, ...prev]);

      // Update stats dynamically without a refresh
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        highSeverity:
          newThreat.severity === "HIGH"
            ? prev.highSeverity + 1
            : prev.highSeverity,
      }));
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />

      <main className="ml-64 p-8 w-full">
        {/* Header Section */}
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Cyber-Threat Intelligence
            </h2>
            <p className="text-slate-500 italic">
              ML-powered network monitoring is active
            </p>
          </div>
          <div className="text-xs font-bold text-green-500 flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            SYSTEM ONLINE
          </div>
        </header>

        {/* Statistics Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Detections"
            value={stats.total}
            icon={<Shield size={24} className="text-blue-600" />}
            bgColor="bg-blue-50"
          />
          <StatCard
            title="High Severity"
            value={stats.highSeverity}
            icon={<AlertCircle size={24} className="text-red-600" />}
            bgColor="bg-red-50"
          />
          <StatCard
            title="Safety Rating"
            value={stats.safeActivities}
            icon={<Activity size={24} className="text-green-600" />}
            bgColor="bg-green-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Column */}
          <div className="lg:col-span-2">
            <ThreatChart />
          </div>

          {/* Recent Alerts Feed Column */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-700">
              <Lock size={18} className="text-slate-400" /> Recent Threat Feed
            </h3>

            <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {threats.length > 0 ? (
                threats.map((t) => (
                  <div
                    key={t.id}
                    className={`p-4 border-l-4 rounded-r-lg transition-all duration-300 ${
                      t.severity === "HIGH"
                        ? "border-red-500 bg-red-50/30"
                        : "border-yellow-500 bg-yellow-50/30"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-800 text-sm">
                        {t.attackType}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(t.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-[11px] text-slate-500">
                        Confidence: {(t.confidence * 100).toFixed(1)}%
                      </p>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                          t.severity === "HIGH"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {t.severity}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <List size={40} className="mb-2 opacity-20" />
                  <p className="text-sm italic">No threats logged yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, bgColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow duration-300">
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
        {title}
      </p>
      <h3 className="text-3xl font-black text-slate-800">{value}</h3>
    </div>
    <div className={`p-4 ${bgColor} rounded-xl`}>{icon}</div>
  </div>
);

export default Dashboard;
