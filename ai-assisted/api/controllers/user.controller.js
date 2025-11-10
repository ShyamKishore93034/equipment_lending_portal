// -- AI Prompt: "Refactor a user controller in Node.js to use async/await, add bcrypt hashing for passwords, Joi validation, and exclude passwords from getAllUsers."
// -- AI Refactor: "Integrated security and validation; AI removed duplicates from manual."

import db from '../db/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { userSchema, loginSchema } from '../utils/validators.js';

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

// AI Refactor: Excluded password from getAllUsers response for security.
export const getAllUsers = async (req, res) => {
  try {
    const rows = await db.allAsync('SELECT id, name, email, role FROM users ORDER BY id ASC');  // Exclude password
    res.json(rows);
  } catch (err) {
    console.error('getAllUsers err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// AI Enhancement: Added Joi validation and bcrypt compare for secure login; refactored from manual plain-text password check.
export const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;
  try {
    const user = await db.getAsync('SELECT * FROM users WHERE email = ?', [email]);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { userId: user.id, email: user.email, role: user.role, name: user.name } });
  } catch (err) {
    console.error('login err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// AI Enhancement: Added Joi validation, bcrypt hashing, and removed duplicate email check from manual.
export const signup = async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email, password, role } = req.body;
  try {
    const existing = await db.getAsync('SELECT 1 FROM users WHERE email = ?', [email]);
    if (existing) return res.status(409).json({ error: 'Email exists' });
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await db.runAsync('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, role]);
    const token = jwt.sign({ userId: result.lastID, email, role }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { userId: result.lastID, email, role, name } });
  } catch (err) {
    console.error('signup err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};