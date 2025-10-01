// HealthCare Website Backend Server
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

// Simple UUID v4 generator function
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const app = express();
const PORT = process.env.PORT || 3000;

const publicDir = path.join(__dirname, "../public");
if (!fs.existsSync(publicDir)) {
  console.warn(`⚠️  Public directory not found at ${publicDir}. Static assets may not be served correctly.`);
}

const databaseDir = path.join(__dirname, "../database");
if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(publicDir));

// Database setup
const dbPath = path.join(databaseDir, "healthcare.db");
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // BMI calculations table
  db.run(`
        CREATE TABLE IF NOT EXISTS bmi_calculations (
            id TEXT PRIMARY KEY,
            bmi REAL NOT NULL,
            category TEXT NOT NULL,
            height REAL NOT NULL,
            height_unit TEXT NOT NULL,
            inches INTEGER DEFAULT 0,
            weight REAL NOT NULL,
            weight_unit TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            session_id TEXT
        )
    `);

  // Diet plans table
  db.run(`
        CREATE TABLE IF NOT EXISTS diet_plans (
            id TEXT PRIMARY KEY,
            bmi REAL NOT NULL,
            goal TEXT NOT NULL,
            activity_level TEXT NOT NULL,
            plan_data TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            session_id TEXT
        )
    `);

  // Exercise plans table
  db.run(`
        CREATE TABLE IF NOT EXISTS exercise_plans (
            id TEXT PRIMARY KEY,
            goal TEXT NOT NULL,
            level TEXT NOT NULL,
            time_availability TEXT NOT NULL,
            plan_data TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            session_id TEXT
        )
    `);

  // Feedback table
  db.run(`
        CREATE TABLE IF NOT EXISTS feedback (
            id TEXT PRIMARY KEY,
            name TEXT,
            type TEXT NOT NULL,
            rating INTEGER NOT NULL,
            feedback_text TEXT NOT NULL,
            allow_display BOOLEAN DEFAULT 0,
            timestamp TEXT NOT NULL,
            approved BOOLEAN DEFAULT 1,
            ip_address TEXT
        )
    `);
});

// API Routes

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// BMI calculation endpoint
app.post("/api/bmi/calculate", (req, res) => {
  const { bmi, category, height, heightUnit, inches = 0, weight, weightUnit, timestamp } = req.body;

  // Validation
  if (!bmi || !category || !height || !weight || !timestamp) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["bmi", "category", "height", "weight", "timestamp"],
    });
  }

  const id = uuidv4();
  const sessionId = req.headers["x-session-id"] || uuidv4();

  const stmt = db.prepare(`
        INSERT INTO bmi_calculations 
        (id, bmi, category, height, height_unit, inches, weight, weight_unit, timestamp, session_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

  stmt.run(
    [id, bmi, category, height, heightUnit || "cm", inches, weight, weightUnit || "kg", timestamp, sessionId],
    function (err) {
      if (err) {
        console.error("Error saving BMI calculation:", err);
        return res.status(500).json({ error: "Failed to save BMI calculation" });
      }

      res.json({
        success: true,
        id: id,
        message: "BMI calculation saved successfully",
      });
    }
  );

  stmt.finalize();
});

// Get recent BMI calculations
app.get("/api/bmi/recent", (req, res) => {
  const sessionId = req.headers["x-session-id"];

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID required" });
  }

  db.get(
    `
        SELECT * FROM bmi_calculations 
        WHERE session_id = ? 
        ORDER BY timestamp DESC 
        LIMIT 1
    `,
    [sessionId],
    (err, row) => {
      if (err) {
        console.error("Error fetching recent BMI:", err);
        return res.status(500).json({ error: "Failed to fetch BMI data" });
      }

      if (!row) {
        return res.status(404).json({ message: "No BMI calculations found" });
      }

      res.json({
        bmi: row.bmi,
        category: row.category,
        timestamp: row.timestamp,
      });
    }
  );
});

// Diet plan generation endpoint
app.post("/api/diet/generate", (req, res) => {
  const { bmi, goal, activity, plan, timestamp } = req.body;

  if (!bmi || !goal || !activity || !plan || !timestamp) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["bmi", "goal", "activity", "plan", "timestamp"],
    });
  }

  const id = uuidv4();
  const sessionId = req.headers["x-session-id"] || uuidv4();

  const stmt = db.prepare(`
        INSERT INTO diet_plans 
        (id, bmi, goal, activity_level, plan_data, timestamp, session_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

  stmt.run([id, bmi, goal, activity, JSON.stringify(plan), timestamp, sessionId], function (err) {
    if (err) {
      console.error("Error saving diet plan:", err);
      return res.status(500).json({ error: "Failed to save diet plan" });
    }

    res.json({
      success: true,
      id: id,
      message: "Diet plan saved successfully",
    });
  });

  stmt.finalize();
});

// Exercise plan generation endpoint
app.post("/api/exercise/generate", (req, res) => {
  const { goal, level, time, plan, timestamp } = req.body;

  if (!goal || !level || !time || !plan || !timestamp) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["goal", "level", "time", "plan", "timestamp"],
    });
  }

  const id = uuidv4();
  const sessionId = req.headers["x-session-id"] || uuidv4();

  const stmt = db.prepare(`
        INSERT INTO exercise_plans 
        (id, goal, level, time_availability, plan_data, timestamp, session_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

  stmt.run([id, goal, level, time, JSON.stringify(plan), timestamp, sessionId], function (err) {
    if (err) {
      console.error("Error saving exercise plan:", err);
      return res.status(500).json({ error: "Failed to save exercise plan" });
    }

    res.json({
      success: true,
      id: id,
      message: "Exercise plan saved successfully",
    });
  });

  stmt.finalize();
});

// Feedback submission endpoint
app.post("/api/feedback/submit", (req, res) => {
  const { name, type, rating, feedback, allowDisplay, timestamp } = req.body;

  if (!type || !rating || !feedback || !timestamp) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["type", "rating", "feedback", "timestamp"],
    });
  }

  // Basic validation
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  if (feedback.length < 10 || feedback.length > 1000) {
    return res.status(400).json({ error: "Feedback must be between 10 and 1000 characters" });
  }

  const id = uuidv4();
  const clientIP = req.ip || req.connection.remoteAddress || "unknown";

  const stmt = db.prepare(`
        INSERT INTO feedback 
        (id, name, type, rating, feedback_text, allow_display, timestamp, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

  stmt.run(
    [id, name || "Anonymous", type, rating, feedback, allowDisplay ? 1 : 0, timestamp, clientIP],
    function (err) {
      if (err) {
        console.error("Error saving feedback:", err);
        return res.status(500).json({ error: "Failed to save feedback" });
      }

      res.json({
        success: true,
        id: id,
        message: "Feedback submitted successfully",
      });
    }
  );

  stmt.finalize();
});

// Get public feedback endpoint
app.get("/api/feedback/public", (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 50); // Max 50 items
  const offset = parseInt(req.query.offset) || 0;

  db.all(
    `
        SELECT id, name, type, rating, feedback_text as feedback, timestamp
        FROM feedback 
        WHERE allow_display = 1 AND approved = 1
        ORDER BY timestamp DESC 
        LIMIT ? OFFSET ?
    `,
    [limit, offset],
    (err, rows) => {
      if (err) {
        console.error("Error fetching public feedback:", err);
        return res.status(500).json({ error: "Failed to fetch feedback" });
      }

      res.json(rows || []);
    }
  );
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🏥 HealthCare server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api/`);
  console.log(`📱 Frontend available at http://localhost:${PORT}`);
});

module.exports = app;
