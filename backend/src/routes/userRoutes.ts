import express, {Request, Response} from 'express';
import {UserController} from "#src/domains/user/controllers/UserController.js";

const router = express.Router();
const userController = new UserController();

router.get('/getList', (request: Request, response: Response) => userController.getList(request, response));
router.post('/create', (request: Request, response: Response) => userController.create(request, response));
router.delete('/delete', (request: Request, response: Response) => userController.delete(request, response));
router.get('/me', (request: Request, response: Response) => userController.me(request, response));

export default router;
