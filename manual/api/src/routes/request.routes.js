import express from "express";
import * as requestCtrl from "../controllers/request.controller.js";

const router = express.Router();

router.get("/", requestCtrl.getAllRequests);
router.post("/", requestCtrl.createRequest);
router.put('/:id/approve', requestCtrl.approveRequest);
router.put('/:id/reject', requestCtrl.rejectRequest);
router.put('/:id/return', requestCtrl.returnRequest);

export default router;
