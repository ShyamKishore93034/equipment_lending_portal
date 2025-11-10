// -- AI Prompt: "Generate equipment controller functions in Node.js with async/await for CRUD, Joi validation, and a new analytics endpoint using SQL counts."
// -- AI Refactor: "Added dynamic updates and Map for grouping; AI suggested overdue checks in JS."
import db from '../db/database.js';
import { equipmentSchema } from '../utils/validators.js';

// AI Refactor: Converted manual callbacks to async/await for readability.
export const getAllEquipment = async (req, res) => {
  try {
    const rows = await db.allAsync('SELECT * FROM equipment ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error('getAllEquipment err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// AI Enhancement: Added overdue check in SQL for efficiency; used Map for grouping as in manual but with async.
export const getAllWithUsers = async (req, res) => {
  const sql = `
    SELECT 
      e.id, e.name, e.category, e.condition, e.quantity, e.available,
      r.id AS requestId, r.from_date, r.to_date,
      u.id AS userId, u.name AS userName, u.email AS userEmail
    FROM equipment e
    LEFT JOIN requests r ON e.id = r.equipment_id AND r.status = 'approved'
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY e.id
  `;
  try {
    const rows = await db.allAsync(sql);
    const equipmentMap = new Map();
    rows.forEach(row => {
      const eqId = row.id;
      if (!equipmentMap.has(eqId)) {
        equipmentMap.set(eqId, {
          id: eqId,
          name: row.name,
          category: row.category,
          condition: row.condition,
          quantity: row.quantity,
          available: row.available,
          currentUsers: []
        });
      }
      if (row.requestId) {
        equipmentMap.get(eqId).currentUsers.push({
          requestId: row.requestId,
          userId: row.userId,
          userName: row.userName,
          userEmail: row.userEmail,
          isOverdue: new Date(row.to_date) < new Date(),
          from_date: row.from_date,
          to_date: row.to_date
        });
      }
    });
    res.json(Array.from(equipmentMap.values()));
  } catch (err) {
    console.error('getAllWithUsers err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// AI Refactor: Added Number() for ID to prevent string issues.
export const getEquipmentById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const row = await db.getAsync('SELECT * FROM equipment WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    console.error('getEquipmentById err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// AI Enhancement: Added Joi validation for create.
export const createEquipment = async (req, res) => {
  const { error } = equipmentSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, category = null, condition = 'Good', quantity = 0 } = req.body;
  const sql = `INSERT INTO equipment (name, category, condition, quantity, available) VALUES (?, ?, ?, ?, ?)`;
  try {
    const result = await db.runAsync(sql, [name, category, condition, quantity, quantity]);
    const newRow = await db.getAsync('SELECT * FROM equipment WHERE id = ?', [result.lastID]);
    res.status(201).json(newRow);
  } catch (err) {
    console.error('createEquipment err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// AI Refactor: Dynamic update with allowed fields, added validation.
export const updateEquipment = async (req, res) => {
  const id = Number(req.params.id);
  const { error } = equipmentSchema.validate(req.body, { allowUnknown: true });
  if (error) return res.status(400).json({ error: error.details[0].message });

  const allowed = ['name', 'category', 'condition', 'quantity', 'available'];
  const updates = [];
  const params = [];
  allowed.forEach(key => {
    if (req.body[key] !== undefined) {
      updates.push(`${key} = ?`);
      params.push(req.body[key]);
    }
  });
  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
  const sql = `UPDATE equipment SET ${updates.join(', ')} WHERE id = ?`;
  params.push(id);
  try {
    const result = await db.runAsync(sql, params);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    const updatedRow = await db.getAsync('SELECT * FROM equipment WHERE id = ?', [id]);
    res.json(updatedRow);
  } catch (err) {
    console.error('updateEquipment err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// AI Refactor: Simple delete with change check.
export const deleteEquipment = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const result = await db.runAsync('DELETE FROM equipment WHERE id = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    console.error('deleteEquipment err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// AI-Generated Enhancement: New analytics endpoint for usage stats (additional feature).
export const getEquipmentAnalytics = async (req, res) => {
  const sql = `
    SELECT e.id, e.name, COUNT(r.id) AS requestCount, 
    SUM(CASE WHEN r.status = 'approved' THEN 1 ELSE 0 END) AS approvedCount
    FROM equipment e
    LEFT JOIN requests r ON e.id = r.equipment_id
    GROUP BY e.id
    ORDER BY requestCount DESC
  `;
  try {
    const rows = await db.allAsync(sql);
    res.json(rows);
  } catch (err) {
    console.error('getEquipmentAnalytics err:', err);
    res.status(500).json({ error: 'Database error' });
  }
};