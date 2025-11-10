// api/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./src/db/database.js";

import userRoutes from "./src/routes/user.routes.js";
import equipmentRoutes from "./src/routes/equipment.routes.js";
import requestRoutes from "./src/routes/request.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// health check
app.get("/", (req, res) => res.json({ message: "API running ✅" }));

// Routes
app.use('/api/user', userRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/request", requestRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

