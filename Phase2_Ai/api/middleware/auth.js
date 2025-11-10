// -- AI Prompt: "Generate JWT authentication middleware for Node.js with verifyToken and requireRole functions, using optional chaining for headers."
// -- AI Refactor: "Improved error messages; AI suggested role-based checks."
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// AI Refactor: Kept manual auth logic but added better error messages; AI suggested using optional chaining for header split.
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// AI Enhancement: Role checker remains simple, but now used consistently in routes for security.
const requireRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  next();
};

module.exports = { verifyToken, requireRole };