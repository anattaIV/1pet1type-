const path = require("path");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const PORT = process.env.PORT || 4000;
const DB_PATH = path.join(__dirname, "data.db");

// --- Database setup ---
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  );
});

// --- HTTP + Express setup ---
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/messages", (req, res) => {
  db.all(
    "SELECT id, author, text, created_at FROM messages ORDER BY created_at DESC LIMIT 50",
    (err, rows) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "db_error" });
      }
      res.json(rows);
    }
  );
});

app.post("/api/messages", (req, res) => {
  const { author, text } = req.body || {};
  if (!author || !text) {
    return res.status(400).json({ error: "author_and_text_required" });
  }

  const stmt = db.prepare(
    "INSERT INTO messages (author, text) VALUES (?, ?)"
  );
  stmt.run(author, text, function (err) {
    if (err) {
      console.error("DB insert error:", err);
      return res.status(500).json({ error: "db_insert_error" });
    }

    const message = {
      id: this.lastID,
      author,
      text,
      created_at: new Date().toISOString(),
    };

    // broadcast to all websocket clients
    broadcastJSON({ type: "message:new", payload: message });

    res.status(201).json(message);
  });
  stmt.finalize();
});

// --- WebSocket setup ---
const wss = new WebSocket.Server({ server, path: "/ws" });

function broadcastJSON(obj) {
  const data = JSON.stringify(obj);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

wss.on("connection", (socket) => {
  console.log("WebSocket client connected");

  socket.on("message", (data) => {
    let parsed;
    try {
      parsed = JSON.parse(data.toString());
    } catch {
      return;
    }

    if (parsed.type === "ping") {
      socket.send(JSON.stringify({ type: "pong", time: Date.now() }));
    }
  });

  socket.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`WebSocket endpoint ws://localhost:${PORT}/ws`);
});

