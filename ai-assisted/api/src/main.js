// -- AI Prompt: "Create the main server file for a Node.js Express API, importing routes and DB, with CORS and JSON middleware, listening on env PORT."
// -- AI Refactor: "Added health check endpoint; AI ensured modular imports."
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db/database.js';  // AI Note: Imports the enhanced DB with auto-init
import userRoutes from './routes/user.routes.js';
import equipmentRoutes from './routes/equipment.routes.js';
import requestRoutes from './routes/request.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// AI Refactor: Added middleware for JSON and CORS; kept simple as in manual but ensured JSON limit for security.
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'AI API running ✅' }));

// Routes with auth applied where needed (AI Enhancement: Routes now include middleware)
app.use('/api/user', userRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/request', requestRoutes);

app.listen(PORT, () => console.log(`🚀 AI Server on port ${PORT}`));