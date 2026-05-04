const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const applicationRoutes = require("./routes/applicationRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const healthRoutes = require("./routes/healthRoutes");
const programRoutes = require("./routes/programRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const universityRoutes = require("./routes/universityRoutes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();

// 1. Private Network Access (PNA) Handshake - MUST BE FIRST
app.use((req, res, next) => {
  // Always allow the Vercel origin for CORS
  res.setHeader("Access-Control-Allow-Origin", "https://waygood-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // This is the CRITICAL header for Chrome's Private Network Access security
  if (req.headers["access-control-request-private-network"]) {
    res.setHeader("Access-Control-Allow-Private-Network", "true");
  }

  // Handle Preflight (OPTIONS) requests immediately
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// 2. Standard Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow resources to be accessed across origins
}));
app.use(express.json());
app.use(morgan("dev"));

// Rate Limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use("/api/", limiter); // Apply rate limiting to all API routes
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
