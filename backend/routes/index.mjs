import rcadeRoutes from './rcadeRoutes.mjs';
import swanRoutes from './swanRoutes.mjs';
import recordsRoutes from './records.mjs';
import jobRoutes from './jobRoutes.mjs';
import adsRoutes from './adsRoutes.mjs';

const initRoutes = (app) => {
  app.use('/rcade', rcadeRoutes);
  app.use('/swan', swanRoutes);
  app.use('/records', recordsRoutes);
  app.use('/jobs', jobRoutes);
  app.use('/ads', adsRoutes)

  app.get('/status', async (req, res) => {
    res.send('OK');
  });
};

export default initRoutes;
