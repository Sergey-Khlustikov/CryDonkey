import express from 'express';
import SwanController from "#src/domains/swan/controllers/SwanController.js";

const router = express.Router();

router.post('/run', async (req, res) => SwanController.run(req, res));

export default router;
