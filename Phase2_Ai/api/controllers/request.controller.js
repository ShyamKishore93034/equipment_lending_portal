// -- AI Prompt: "Create request controller in Node.js with async/await for create/approve/reject/return, overlap checks, pagination, and new history/my endpoints."
// -- AI Refactor: "Enhanced overlap SQL; AI added overdue flag and user-specific queries."

import db from '../db/database.js';
import { requestSchema } from '../utils/validators.js';

// AI Refactor: Used Date objects for validation; enhanced overlap check with quantity.
export const createRequest = async (req, res) => {
  const { error } = requestSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { user_id, equipment_id, from_date, to_date } = req.body;
  try {
    const equipment = await db.getAsync('SELECT quantity, available FROM equipment WHERE id = ?', [equipment_id]);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

    const overlapSql = `
      SELECT COUNT(*) AS overlapCount FROM requests 
      WHERE equipment_id = ? AND status IN ('pending', 'approved')
      AND ((from_date <= ? AND to_date >= ?) OR (from_date <= ? AND to_date >= ?) OR (from_date >= ? AND to_date <= ?))
    `;
    const overlap = await db.getAsync(overlapSql, [equipment_id, from_date, from_date, to_date, to_date, from_date, to_date]);
    if (overlap.overlapCount >= equipment.quantity) {
      return res.status(400).json({ error: 'Equipment not available (quantity limit)' });
    }

    const result = await db.runAsync('INSERT INTO requests (user_id, equipment_id, from_date, to_date) VALUES (?, ?, ?, ?)', [user_id, equipment_id, from_date, to_date]);
    res.status(201).json({ requestId: result.lastID });
  } catch (err) {
    console.error('createRequest err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// AI Refactor: Combined approve logic with available update.
export const approveRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await db.getAsync("SELECT equipment_id FROM requests WHERE id = ? AND status = 'pending'", [id]);
    if (!request) return res.status(404).json({ error: 'Request not found or processed' });

    await db.runAsync('UPDATE equipment SET available = available - 1 WHERE id = ?', [request.equipment_id]);
    await db.runAsync("UPDATE requests SET status = 'approved' WHERE id = ?", [id]);
    res.json({ message: 'Approved' });
  } catch (err) {
    console.error('approveRequest err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// AI Refactor: Similar to approve, with change check.
export const rejectRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.runAsync("UPDATE requests SET status = 'rejected' WHERE id = ? AND status = 'pending'", [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Request not found or processed' });
    res.json({ message: 'Rejected' });
  } catch (err) {
    console.error('rejectRequest err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// AI Refactor: Return logic with available increment.
export const returnRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await db.getAsync("SELECT equipment_id FROM requests WHERE id = ? AND status = 'approved'", [id]);
    if (!request) return res.status(404).json({ error: 'Request not found or not approved' });

    await db.runAsync('UPDATE equipment SET available = available + 1 WHERE id = ?', [request.equipment_id]);
    await db.runAsync("UPDATE requests SET status = 'returned' WHERE id = ?", [id]);
    res.json({ message: 'Returned' });
  } catch (err) {
    console.error('returnRequest err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// AI Enhancement: Added overdue flag in SQL; pagination support.
export const getAllRequests = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sql = `
    SELECT r.id, r.status, r.from_date, r.to_date,
    CASE WHEN r.status = 'approved' AND r.to_date < DATE('now') THEN 1 ELSE 0 END AS isOverdue,
    e.name AS equipmentName, u.name AS userName, u.email AS userEmail
    FROM requests r
    JOIN equipment e ON r.equipment_id = e.id
    JOIN users u ON r.user_id = u.id
    ORDER BY r.id DESC
    LIMIT ? OFFSET ?
  `;
  try {
    const rows = await db.allAsync(sql, [limit, offset]);
    res.json(rows);
  } catch (err) {
    console.error('getAllRequests err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// AI-Generated Enhancement: New history endpoint with optional user filter and pagination.
export const getRequestHistory = async (req, res) => {
  const { user_id } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT r.id, r.status, r.from_date, r.to_date,
    e.name AS equipmentName
    FROM requests r
    JOIN equipment e ON r.equipment_id = e.id
  `;
  const params = [];
  if (user_id) {
    sql += ' WHERE r.user_id = ?';
    params.push(user_id);
  }
  sql += ' ORDER BY r.id DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  try {
    const rows = await db.allAsync(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('getRequestHistory err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// AI-Generated Enhancement: New endpoint for user's own requests (auth-protected).
export const getMyRequests = async (req, res) => {
  const user_id = req.user.userId;  // From auth middleware
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sql = `
    SELECT r.id, r.status, r.from_date, r.to_date,
    e.name AS equipmentName
    FROM requests r
    JOIN equipment e ON r.equipment_id = e.id
    WHERE r.user_id = ?
    ORDER BY r.id DESC
    LIMIT ? OFFSET ?
  `;
  try {
    const rows = await db.allAsync(sql, [user_id, limit, offset]);
    res.json(rows);
  } catch (err) {
    console.error('getMyRequests err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};