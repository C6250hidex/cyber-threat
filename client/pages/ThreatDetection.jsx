import { useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

const ThreatDetection = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("logfile", file);

    setLoading(true);
    try {
      const { data } = await api.post("/threats/analyze", formData);
      setResult(data);
    } catch (err) {
      alert("Analysis failed. Make sure Backend and ML service are running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-8 w-full bg-slate-50 min-h-screen">
        <h2 className="text-3xl font-bold mb-6">Threat Detection Engine</h2>

        <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl">
          <p className="mb-4 text-slate-600">
            Upload network logs (CSV) for real-time ML analysis.
          </p>
          <form onSubmit={handleUpload}>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6"
            />
            <button
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-slate-400"
            >
              {loading ? "Analyzing..." : "Start ML Analysis"}
            </button>
          </form>
        </div>

        {result && (
          <div className="mt-8 bg-white p-6 rounded-xl shadow-md border-t-4 border-red-500 animate-fade-in">
            <h3 className="text-xl font-bold mb-2">Detection Result</h3>
            <p className="text-lg">
              Status:{" "}
              <span className="font-bold text-red-600">
                {result.threat.attackType} Detected
              </span>
            </p>
            <p className="text-slate-600 text-sm font-mono">
              Incident ID: {result.threat.id}
            </p>
            <p className="mt-2 text-slate-700 bg-slate-100 p-3 rounded">
              <strong>Recommendation:</strong> {result.threat.recommendation}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ThreatDetection;
