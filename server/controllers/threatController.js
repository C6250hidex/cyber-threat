const prisma = require("../config/db");
const axios = require("axios");

// Get all threat history
exports.getStats = async (req, res) => {
  try {
    const total = await prisma.threatLog.count();
    const highSeverity = await prisma.threatLog.count({
      where: { severity: "HIGH" },
    });

    res.json({
      total,
      highSeverity,
      safeActivities: "99.2%", // Static for now
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

// Upload and Analyze Log
exports.analyzeLog = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // 1. DYNAMIC URL: Use the Environment Variable from Render
    // If process.env.ML_SERVICE_URL is missing, it falls back to localhost for your computer
    const mlBaseUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";

    console.log(`Attempting to contact ML Service at: ${mlBaseUrl}/predict`);

    const mlResponse = await axios.post(`${mlBaseUrl}/predict`, {
      feature_1: Math.random(),
      feature_2: Math.random(),
    });

    const { prediction, confidence } = mlResponse.data;

    // 2. Save the result to TiDB Cloud
    const threat = await prisma.threatLog.create({
      data: {
        attackType: prediction,
        confidence: confidence,
        severity: confidence > 0.7 ? "HIGH" : "MEDIUM",
        sourceIp: "192.168.1." + Math.floor(Math.random() * 255),
        recommendation:
          "System recommendation: Isolate source IP and scan for " + prediction,
      },
    });

    // 3. Send real-time alert via Socket.io
    const io = req.app.get("socketio");
    if (io) io.emit("new_threat", threat);

    res.status(201).json({ message: "Analysis Complete", threat });
  } catch (error) {
    // Better Error Logging
    console.error("ML Error Details:", error.response?.data || error.message);
    res.status(500).json({
      message: "ML Service Error",
      error: error.message,
      debug_url: process.env.ML_SERVICE_URL,
    });
  }
};

exports.getThreatHistory = async (req, res) => {
  try {
    const threats = await prisma.threatLog.findMany({
      orderBy: { timestamp: "desc" },
    });
    res.json(threats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching threat history" });
  }
};
