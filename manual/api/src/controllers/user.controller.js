import db from "../db/database.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "simulated-secret-2025";

// health check
export const getAllUsers = (req, res) => {
  const sql = "SELECT * FROM users ORDER BY id ASC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("getAllUsers err:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  db.get(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, user) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "DB error" });
      }
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      try {
        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: "24h" }
        );

        res.status(200).json({
          token,
          user: {
            userId: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
          },
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );
};

export const signup = (req, res) => {
  const { name, email, password, role } = req.body;

  db.get("SELECT 1 FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "DB error" });
    }
    if (row) {
      return res.status(409).json({ error: "Email already exists" });
    }

    try {
      console.log(req.body);
      db.get("SELECT 1 FROM users WHERE email = ?", [email], (err, row) => {
        if (err) {
          console.error("DB error:", err);
          return res.status(500).json({ error: "DB error" });
        }
        if (row) {
          return res.status(409).json({ error: "Email already exists" });
        }
      });

      const stmt = db.prepare(`
      INSERT INTO users (name, email, password, role) 
      VALUES (?, ?, ?, ?)
    `);
      const result = stmt.run(name, email, password, role);

      const token = jwt.sign(
        { userId: result.lastInsertRowid, email, role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(201).json({
        token,
        user: {
          userId: result.lastInsertRowid,
          email,
          role,
          name,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};
