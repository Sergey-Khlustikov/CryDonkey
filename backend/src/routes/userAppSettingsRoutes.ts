import express, {Request, Response} from 'express';
import UserAppSettingsController from "#src/domains/user_app_settings/controllers/UserAppSettingsController.js";

const router = express.Router();
const userAppSettingsController = new UserAppSettingsController();

router.get('/', (request: Request, response: Response) => userAppSettingsController.get(request, response));
router.patch('/update', (request: Request, response: Response) => userAppSettingsController.update(request, response));

export default router;
