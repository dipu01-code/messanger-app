
import express from "express";
import http from "node:http";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Server } from "socket.io";
import pool from "./db.js";

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL and JWT_SECRET must be set in .env");
}

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: "20kb" }));

const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = Number(process.env.PORT) || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

function createToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function authenticateToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    console.error("Health check:", err.message);
    res.status(503).json({ status: "error", database: "disconnected" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      return res.status(400).json({
        error: "Username must be 3–30 letters, numbers, or underscores",
      });
    }

    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({
        error: "Password must be at least 8 characters and at most 72 bytes",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (username, password_hash)
       VALUES ($1, $2)
       RETURNING id, username, created_at`,
      [username, passwordHash]
    );

    const user = result.rows[0];

    res.status(201).json({
      token: createToken(user),
      user,
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Username already exists" });
    }

    console.error("Registration:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");

    const result = await pool.query(
      "SELECT id, username, password_hash FROM users WHERE username = $1",
      [username]
    );

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.json({
      token: createToken(user),
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error("Login:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/me", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Get profile:", err.message);
    res.status(500).json({ error: "Could not load profile" });
  }
});

app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username
       FROM users
       WHERE id <> $1
       ORDER BY username`,
      [req.user.id]
    );

    res.json({ users: result.rows });
  } catch (err) {
    console.error("List users:", err.message);
    res.status(500).json({ error: "Could not load users" });
  }
});

app.get("/api/messages/:userId", authenticateToken, async (req, res) => {
  try {
    const peerId = Number(req.params.userId);

    if (!Number.isSafeInteger(peerId) || peerId < 1) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const peer = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [peerId]
    );

    if (!peer.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await pool.query(
      `SELECT id, sender_id, receiver_id, content, created_at
       FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at DESC, id DESC
       LIMIT 500`,
      [req.user.id, peerId]
    );

    res.json({ messages: result.rows.reverse() });
  } catch (err) {
    console.error("Load messages:", err.message);
    res.status(500).json({ error: "Could not load messages" });
  }
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    socket.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  const userId = Number(socket.user.id);

  socket.join(`user:${userId}`);

  socket.on("send_message", async (payload, acknowledge) => {
    const ack = typeof acknowledge === "function" ? acknowledge : () => {};

    try {
      const receiverId = Number(payload?.receiverId);
      const content = typeof payload?.content === "string"
        ? payload.content.trim()
        : "";

      if (
        !Number.isSafeInteger(receiverId) ||
        receiverId < 1 ||
        receiverId === userId
      ) {
        return ack({ success: false, error: "Invalid recipient" });
      }

      if (content.length < 1 || content.length > 5000) {
        return ack({ success: false, error: "Message must be 1–5000 characters" });
      }

      const recipient = await pool.query(
        "SELECT id FROM users WHERE id = $1",
        [receiverId]
      );

      if (!recipient.rows.length) {
        return ack({ success: false, error: "Recipient not found" });
      }

      const result = await pool.query(
        `INSERT INTO messages (sender_id, receiver_id, content)
         VALUES ($1, $2, $3)
         RETURNING id, sender_id, receiver_id, content, created_at`,
        [userId, receiverId, content]
      );

      const savedMessage = result.rows[0];

      io.to(`user:${userId}`)
        .to(`user:${receiverId}`)
        .emit("new_message", savedMessage);

      ack({ success: true, message: savedMessage });
    } catch (err) {
      console.error("Send message:", err.message);
      ack({ success: false, error: "Message could not be sent" });
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Messenger API listening on port ${PORT}`);
});

async function shutdown() {
  server.close();
  io.close();
  await pool.end();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
