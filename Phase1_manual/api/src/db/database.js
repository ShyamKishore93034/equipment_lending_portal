import sqlite3 from "sqlite3";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Resolve the DB path from .env
const dbPath = path.resolve(process.env.DB_PATH || "../db/sqlite.db");

// Create a singleton DB connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("DB connect error:", err.message);
  } else {
    console.log("Connected to DB:", dbPath);
  }
});

export default db;
