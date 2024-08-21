import express from 'express';
import RcadeController from '../domains/rcade/controllers/RcadeController.mjs';
const router = express.Router();

router.post('/run', async (req, res) => RcadeController.run(req, res));

export default router;
