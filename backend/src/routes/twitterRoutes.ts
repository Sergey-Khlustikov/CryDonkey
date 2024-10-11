import express from 'express';
import TwitterController from '../domains/twitter/controllers/TwitterController';

const router = express.Router();

router.post('/writePost', async (req, res) => TwitterController.writePost(req, res));

export default router;
