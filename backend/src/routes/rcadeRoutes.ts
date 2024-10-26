import express from 'express';
import RcadeController from "#src/domains/rcade/controllers/RcadeController.js";

const router = express.Router();

router.post('/run', async (req, res) => RcadeController.run(req, res));

export default router;
