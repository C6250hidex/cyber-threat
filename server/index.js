const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const threatRoutes = require("./routes/threatRoutes");
const reportRoutes = require("./routes/reportRoutes");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: ["http://localhost:5173", "https://cyber-threat-rose.vercel.app"],
    credentials: true,
  }),
);

// Also update the Socket.io CORS
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://cyber-threat-rose.vercel.app"],
    methods: ["GET", "POST"],
  },
});
// Make io accessible to our routes
app.set("socketio", io);

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter); // Apply rate limiting to all requests

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/threats", threatRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("Cybersecurity Threat Detection API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
io.on("connection", (socket) => {
  console.log("A user connected to socket:", socket.id);
});

const PORT = process.env.PORT || 10000; // Render uses 10000 by default
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Production Server running on port ${PORT}`);
});
