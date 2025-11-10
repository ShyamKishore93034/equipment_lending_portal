// -- AI Prompt: "Create a validators.js file with Joi schemas for user signup/login, equipment, and request data in a Node.js API."
// -- AI Refactor: "New file for input validation; AI generated schemas with defaults and constraints."
const Joi = require('joi');

// AI-Generated: Entire file suggested by AI (prompt: "Create Joi schemas for user, login, equipment, and request validation in Node.js").
exports.userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'staff', 'admin').required(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.equipmentSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().optional(),
  condition: Joi.string().default('Good'),
  quantity: Joi.number().integer().min(0).default(0),
});

exports.requestSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  equipment_id: Joi.number().integer().required(),
  from_date: Joi.date().iso().required(),
  to_date: Joi.date().iso().greater(Joi.ref('from_date')).required(),
});