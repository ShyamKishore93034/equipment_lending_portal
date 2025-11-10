CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
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
  from_date TEXT,
  to_date TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(equipment_id) REFERENCES equipment(id)
);
