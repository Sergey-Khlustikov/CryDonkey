import rcadeRoutes from './rcadeRoutes.mjs';
import swanRoutes from './swanRoutes.mjs';
import recordsRoutes from './records.mjs';
import jobRoutes from './jobRoutes.mjs';
import adsRoutes from './adsRoutes.mjs';
import aiRoutes from './aiRoutes.mjs';
import twitterRoutes from './twitterRoutes.mjs';
import { run } from '../domains/automatization/blum/blum.mjs';

const initRoutes = (app) => {
  app.use('/rcade', rcadeRoutes);
  app.use('/swan', swanRoutes);
  app.use('/records', recordsRoutes);
  app.use('/jobs', jobRoutes);
  app.use('/ads', adsRoutes)
  app.use('/ai', aiRoutes);
  app.use('/twitter', twitterRoutes);

  app.get('/status', async (req, res) => {
    res.send('OK');
  });

  app.post('/blum/run', async (req, res) => {
    await run();
  });
};

export default initRoutes;
