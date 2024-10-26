import express from 'express';
import BlumController from "#src/domains/automatization/blum/controllers/BlumController.js";

const router = express.Router();

router.post('/run', async (req, res) => BlumController.run(req, res));

export default router;
