const express = require("express");
const router = express.Router();
const {
  getThreatHistory,
  analyzeLog,
  getStats,
} = require("../controllers/threatController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/history", protect, getThreatHistory);
router.post("/analyze", protect, upload.single("logfile"), analyzeLog);
router.get("/stats", protect, getStats);

module.exports = router;
