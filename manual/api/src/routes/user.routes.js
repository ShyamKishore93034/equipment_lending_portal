// api/src/routes/equipment.routes.js
import express from "express";
import * as userCtrl from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", userCtrl.getAllUsers);
router.post("/login", userCtrl.login);
router.post("/signup", userCtrl.signup);

export default router;
