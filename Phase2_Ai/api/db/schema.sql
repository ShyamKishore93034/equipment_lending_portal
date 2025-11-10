-- AI Prompt: "Create a SQL schema for a school equipment lending system with tables for users (with roles), 
-- equipment (with quantity and availability), and requests (with status and dates), including foreign keys."
-- AI Refactor: "Kept core from manual but noted hashing for passwords; AI added comments for clarity."

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,  -- Now hashed with bcrypt for security (AI-suggested enhancement)
  role TEXT CHECK(role IN ('student','staff','admin')) NOT NULL
);

CREATE TABLE IF NOT EXISTS equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT,
  condition TEXT NOT NULL DEFAULT 'Good',
  quantity INTEGER DEFAULT 0,
  available INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  equipment_id INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  from_date TEXT,  -- ISO format recommended for date comparisons
  to_date TEXT,    -- ISO format
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(equipment_id) REFERENCES equipment(id)
);