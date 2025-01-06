import express, {Request, Response} from 'express';
import AdsPowerAddressController from "#src/domains/ads/controllers/AdsPowerAddressController.js";

const router = express.Router();
const adsPowerAddressController = new AdsPowerAddressController();

router.post('/create', (request: Request, response: Response) => adsPowerAddressController.create(request, response));
router.patch('/update/:id', (request: Request, response: Response) => adsPowerAddressController.update(request, response));
router.delete('/delete/:id', (request: Request, response: Response) => adsPowerAddressController.delete(request, response));
router.get('/getList', (request: Request, response: Response) => adsPowerAddressController.getList(request, response));

export default router;
