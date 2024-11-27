import express, {Request, Response} from 'express';
import PeaqController from "#src/domains/projects/peaq/controllers/PeaqController.js";

const router = express.Router();

router.post('/run/:part', async (req: Request, res: Response) => PeaqController.run(req, res));

export default router;
