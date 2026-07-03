const express = require("express");
const router = express.Router();
const { generateThreatReport } = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

router.get("/pdf/:id", protect, generateThreatReport);

module.exports = router;
