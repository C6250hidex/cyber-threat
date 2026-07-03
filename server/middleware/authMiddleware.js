const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // 1. Look for token in Header OR in URL Query Parameter (?token=...)
  const token = req.headers.authorization?.split(" ")[1] || req.query.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to request
    next();
  } catch (error) {
    console.error("JWT Verify Error:", error.message);
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Administrators only" });
  }
};

module.exports = { protect, adminOnly };
