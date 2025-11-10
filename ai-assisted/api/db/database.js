// -- AI Prompt: "Generate a Node.js SQLite database connection module with promisified methods for async/await,
//  including an auto-init function to run schema and seed if tables are missing, using fs for reading SQL files."
// -- AI Refactor: "Converted to async/await; AI added initDB for automatic setup."

import sqlite3 from "sqlite3";
import { promisify } from "util";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// AI Enhancement: Resolved DB path using process.env for flexibility, added verbose mode for debugging.
const dbPath = path.resolve(process.env.DB_PATH || "../../db/sqlite.db");
const sqlite = sqlite3.verbose();
const db = new sqlite.Database(dbPath, (err) => {
  if (err) console.error("DB connect error:", err);
  else console.log("Connected to DB:", dbPath);
});

// AI-Generated: Promisified DB methods to enable async/await, improving over manual callback hell.
db.getAsync = promisify(db.get.bind(db));
db.allAsync = promisify(db.all.bind(db));
db.runAsync = promisify(db.run.bind(db));

// AI Enhancement: Added auto-init function to run schema and seed on startup if tables are missing – suggested by AI for easier setup.
async function initDB() {
  try {
    const tableCount = await db.getAsync(
      'SELECT COUNT(*) as count FROM sqlite_master WHERE type="table" AND name="users"'
    );
    if (tableCount.count === 0) {
      console.log("Initializing DB...");
      const schema = fs.readFileSync(
        path.join(__dirname, "schema.sql"),
        "utf8"
      );
      await db.exec(schema); // exec for multi-statements
      const seed = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8");
      await db.exec(seed);
      console.log("DB initialized with schema and seed.");
    }
  } catch (err) {
    console.error("DB init error:", err);
  }
}

initDB();

export default db;
