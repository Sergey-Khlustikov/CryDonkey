import express from 'express';
import AIController from '../domains/ai/controllers/AIController';

const router = express.Router();

router.post('/generate', (req, res) => AIController.generate(req, res));

export default router;
