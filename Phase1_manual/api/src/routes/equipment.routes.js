import express from "express";
import * as equipmentCtrl from "../controllers/equipment.controller.js";

const router = express.Router();

router.get("/admin", equipmentCtrl.getAllWithUsers);

router.get("/", equipmentCtrl.getAllEquipment);
router.get("/:id", equipmentCtrl.getEquipmentById);
router.post("/", equipmentCtrl.createEquipment);
router.put("/:id", equipmentCtrl.updateEquipment);
router.delete("/:id", equipmentCtrl.deleteEquipment);


export default router;
