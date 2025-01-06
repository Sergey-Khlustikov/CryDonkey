import express, {Request, Response} from 'express';
import {AuthController} from "#src/domains/auth/controllers/AuthController.js";

const router = express.Router();

router.post('/login', (req: Request, res: Response) => new AuthController().login(req, res));
router.post('/logout', (req: Request, res: Response) => new AuthController().logout(req, res));

export default router;
