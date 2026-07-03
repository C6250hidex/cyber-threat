import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import { Download } from "lucide-react";

const ThreatHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await api.get("/threats/history");
      setHistory(data);
    };
    fetchHistory();
  }, []);

  const downloadReport = (id) => {
    const token = localStorage.getItem("token");
    // Pass the token as a query parameter so the middleware can see it
    const url = `http://localhost:5000/api/reports/pdf/${id}?token=${token}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-8 w-full bg-slate-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800">
            Threat Detection History
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 text-slate-600 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Attack Type</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 font-semibold text-slate-700">
                    {log.attackType}
                  </td>
                  <td className="p-4">{(log.confidence * 100).toFixed(1)}%</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        log.severity === "HIGH"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => downloadReport(log.id)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-bold"
                    >
                      <Download size={16} /> PDF Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ThreatHistory;
