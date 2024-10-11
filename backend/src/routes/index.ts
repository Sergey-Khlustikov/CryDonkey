import rcadeRoutes from './rcadeRoutes';
import swanRoutes from './swanRoutes';
import jobRoutes from './jobRoutes';
import adsRoutes from './adsRoutes';
import aiRoutes from './aiRoutes';
import twitterRoutes from './twitterRoutes';
import blumRoutes from './blumRoutes';

const initRoutes = (app) => {
  app.use('/rcade', rcadeRoutes);
  app.use('/swan', swanRoutes);
  app.use('/jobs', jobRoutes);
  app.use('/ads', adsRoutes)
  app.use('/ai', aiRoutes);
  app.use('/twitter', twitterRoutes);
  app.use('/blum', blumRoutes);

  app.get('/status', async (req, res) => {
    res.send('OK');
  });
};

export default initRoutes;
