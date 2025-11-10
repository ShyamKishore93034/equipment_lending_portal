// -- AI Prompt: "Generate Express routes for equipment with auth middleware, including admin and analytics paths."
// -- AI Refactor: "Applied roles to protected routes; AI added new analytics route."

import express from 'express';
import * as equipmentCtrl from '../controllers/equipment.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

// AI Enhancement: Added auth middleware to protected routes (e.g., admin-only).
const router = express.Router();

router.get('/admin', verifyToken, requireRole(['admin', 'staff']), equipmentCtrl.getAllWithUsers);
router.get('/analytics', verifyToken, requireRole(['admin']), equipmentCtrl.getEquipmentAnalytics);  // New enhancement

router.get('/', equipmentCtrl.getAllEquipment);
router.get('/:id', equipmentCtrl.getEquipmentById);
router.post('/', verifyToken, requireRole(['admin']), equipmentCtrl.createEquipment);
router.put('/:id', verifyToken, requireRole(['admin']), equipmentCtrl.updateEquipment);
router.delete('/:id', verifyToken, requireRole(['admin']), equipmentCtrl.deleteEquipment);

export default router;