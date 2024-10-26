import express from 'express';
import AIController from "#src/domains/ai/controllers/AIController.js";

const router = express.Router();

router.post('/generate', (req, res) => AIController.generate(req, res));

export default router;
