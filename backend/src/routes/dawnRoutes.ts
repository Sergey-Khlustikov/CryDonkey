import express, {Request, Response} from 'express';
import DawnController from "#src/domains/extensions/dawn/controllers/DawnController.js";

const router = express.Router();

router.post('/checkAuth', async (req: Request, res: Response) => DawnController.checkAuth(req, res));

export default router;
