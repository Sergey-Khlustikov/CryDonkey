import express, {Request, Response} from 'express';
import IdaoController from "#src/domains/automatization/idao/controllers/IdaoController.js";

const router = express.Router();

router.post('/run', async (req: Request, res: Response) => IdaoController.run(req, res));

export default router;
