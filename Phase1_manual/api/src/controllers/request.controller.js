// manual/api/controllers/request.controller.js
import db from "../db/database.js";

// --- 1. Student: Create Request ---
export const createRequest = (req, res) => {
  const { user_id, equipment_id, from_date, to_date } = req.body;

  if (!from_date || !to_date || from_date > to_date) {
    return res.status(400).json({ error: "Invalid date range" });
  }

  // Get equipment quantity
  db.get(
    "SELECT quantity FROM equipment WHERE id = ?",
    [equipment_id],
    (err, equipment) => {
      if (err) {
        console.error("Equipment fetch error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (!equipment) {
        return res.status(404).json({ error: "Equipment not found" });
      }

      const quantity = equipment.quantity;

      // --- 4. Prevent overlapping bookings (quantity-aware) ---
      const overlapSql = `
        SELECT COUNT(*) AS overlapCount FROM requests 
        WHERE equipment_id = ? 
          AND status IN ('pending', 'approved')
          AND (
            (from_date <= ? AND to_date >= ?) OR
            (from_date <= ? AND to_date >= ?) OR
            (from_date >= ? AND to_date <= ?)
          )
      `;

      db.get(
        overlapSql,
        [
          equipment_id, from_date, from_date,
          to_date, to_date, from_date, to_date
        ],
        (err, row) => {
          if (err) {
            console.error("Overlap check error:", err);
            return res.status(500).json({ error: "Database error" });
          }

          const overlapCount = row.overlapCount;
          if (overlapCount >= quantity) {
            return res.status(400).json({
              error: "Equipment not available for selected dates (quantity limit reached)"
            });
          }

          // Insert request
          db.run(
            `INSERT INTO requests (user_id, equipment_id, from_date, to_date)
             VALUES (?, ?, ?, ?)`,
            [user_id, equipment_id, from_date, to_date],
            function (err) {
              if (err) {
                console.error("Create request error:", err);
                return res.status(500).json({ error: "Database error" });
              }
              res.status(201).json({ requestId: this.lastID });
            }
          );
        }
      );
    }
  );
};

// --- 2. Admin: Approve Request ---
export const approveRequest = (req, res) => {
  const { id } = req.params;

  db.get(
    "SELECT equipment_id FROM requests WHERE id = ? AND status = 'pending'",
    [id],
    (err, request) => {
      if (err || !request) {
        return res.status(404).json({ error: "Request not found or already processed" });
      }

      const equipmentId = request.equipment_id;

      // Decrement available
      db.run(
        "UPDATE equipment SET available = available - 1 WHERE id = ?",
        [equipmentId],
        (err) => {
          if (err) console.error("Update available error:", err);
        }
      );

      // Approve request
      db.run(
        "UPDATE requests SET status = 'approved' WHERE id = ?",
        [id],
        function (err) {
          if (err) {
            console.error("Approve error:", err);
            return res.status(500).json({ error: "Database error" });
          }
          res.json({ message: "Approved" });
        }
      );
    }
  );
};

// --- 2. Admin: Reject Request ---
export const rejectRequest = (req, res) => {
  const { id } = req.params;

  db.run(
    "UPDATE requests SET status = 'rejected' WHERE id = ? AND status = 'pending'",
    [id],
    function (err) {
      if (err) {
        console.error("Reject error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Request not found or already processed" });
      }
      res.json({ message: "Rejected" });
    }
  );
};

// --- 3. Admin: Mark as Returned ---
export const returnRequest = (req, res) => {
  const { id } = req.params;

  db.get(
    "SELECT equipment_id FROM requests WHERE id = ? AND status = 'approved'",
    [id],
    (err, request) => {
      if (err || !request) {
        return res.status(404).json({ error: "Request not found or not approved" });
      }

      const equipmentId = request.equipment_id;

      // Increment available
      db.run(
        "UPDATE equipment SET available = available + 1 WHERE id = ?",
        [equipmentId],
        (err) => {
          if (err) console.error("Restore available error:", err);
        }
      );

      // Mark returned
      db.run(
        "UPDATE requests SET status = 'returned' WHERE id = ?",
        [id],
        function (err) {
          if (err) {
            console.error("Return error:", err);
            return res.status(500).json({ error: "Database error" });
          }
          res.json({ message: "Returned" });
        }
      );
    }
  );
};

// --- Admin: Get All Requests ---
export const getAllRequests = (req, res) => {
  const sql = `
    SELECT 
      r.id, r.status, r.from_date, r.to_date,
      e.name AS equipmentName,
      u.name AS userName, u.email AS userEmail
    FROM requests r
    JOIN equipment e ON r.equipment_id = e.id
    JOIN users u ON r.user_id = u.id
    ORDER BY r.id DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Get requests error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
};