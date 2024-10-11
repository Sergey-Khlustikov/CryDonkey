import express from 'express';
import SwanController from '../domains/swan/controllers/SwanController';

const router = express.Router();

router.post('/run', async (req, res) => SwanController.run(req, res));

export default router;
