import rcadeRoutes from "#src/routes/rcadeRoutes.js";
import swanRoutes from "#src/routes/swanRoutes.js";
import jobRoutes from "#src/routes/jobRoutes.js";
import adsRoutes from "#src/routes/adsRoutes.js";
import aiRoutes from "#src/routes/aiRoutes.js";
import twitterRoutes from "#src/routes/twitterRoutes.js";
import blumRoutes from "#src/routes/blumRoutes.js";
import {Application} from "express";

const initRoutes = (app: Application) => {
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
