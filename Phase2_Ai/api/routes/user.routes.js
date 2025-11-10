// -- AI Prompt: "Generate user routes in Express for getAll, login, and signup, with optional admin auth on getAll."
// -- AI Refactor: "Made getAll protected; AI kept open for auth endpoints."

import express from 'express';
import * as userCtrl from '../controllers/user.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

// AI Refactor: Added optional auth for getAllUsers if needed; login/signup open.
const router = express.Router();

router.get('/', verifyToken, requireRole(['admin']), userCtrl.getAllUsers);  // Protected for admin
router.post('/login', userCtrl.login);
router.post('/signup', userCtrl.signup);

export default router;