const express = require("express");
const router = express.Router();
const {
  analyzeLog,
  getThreatHistory,
  getStats,
} = require("../controllers/threatController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Ensure this is router.post, NOT router.get
router.post("/analyze", protect, upload.single("logfile"), analyzeLog);

router.get("/history", protect, getThreatHistory);
router.get("/stats", protect, getStats);

module.exports = router;
