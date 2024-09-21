import express from 'express';
import JobsController from '../domains/jobs/controllers/JobsController.mjs';

const router = express.Router();

// Получение задач с фильтрацией
router.get('/',  (req, res) => JobsController.getList(req, res));
router.post('/:id/retry',  (req, res) => JobsController.retryJob(req, res));
router.delete('/:id/remove', (req, res) => JobsController.removeJob(req, res));
router.delete('/deleteAll',  (req, res) => JobsController.deleteAll(req, res));
router.post('/retryFailed', (req, res) => JobsController.retryFailed(req, res));

export default router;
