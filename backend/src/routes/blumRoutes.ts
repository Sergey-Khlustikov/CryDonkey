import express from 'express';
import BlumController from '../domains/automatization/blum/controllers/BlumController';

const router = express.Router();

router.post('/run', async (req, res) => BlumController.run(req, res));

export default router;
