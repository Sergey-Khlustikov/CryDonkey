import express from 'express';
import TwitterController from "#src/domains/twitter/controllers/TwitterController.js";

const router = express.Router();

router.post('/writePost', async (req, res) => TwitterController.writePost(req, res));

export default router;
