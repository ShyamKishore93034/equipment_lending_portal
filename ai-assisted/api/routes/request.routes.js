// -- AI Prompt: "Create Express routes for requests with role-based auth, including history and my requests endpoints."
// -- AI Refactor: "Protected actions by role; AI suggested student-only for create."

import express from 'express';
import * as requestCtrl from '../controllers/request.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

// AI Enhancement: Added auth and roles; new endpoints for history and my requests.
const router = express.Router();

router.get('/', verifyToken, requireRole(['admin', 'staff']), requestCtrl.getAllRequests);
router.get('/history', verifyToken, requireRole(['admin', 'staff']), requestCtrl.getRequestHistory);  // Admin/staff view
router.get('/my', verifyToken, requestCtrl.getMyRequests);  // User-specific
router.post('/', verifyToken, requireRole(['student']), requestCtrl.createRequest);
router.put('/:id/approve', verifyToken, requireRole(['admin', 'staff']), requestCtrl.approveRequest);
router.put('/:id/reject', verifyToken, requireRole(['admin', 'staff']), requestCtrl.rejectRequest);
router.put('/:id/return', verifyToken, requireRole(['admin', 'staff']), requestCtrl.returnRequest);

export default router;