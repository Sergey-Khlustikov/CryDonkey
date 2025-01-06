import rcadeRoutes from "#src/routes/rcadeRoutes.js";
import swanRoutes from "#src/routes/swanRoutes.js";
import jobRoutes from "#src/routes/jobRoutes.js";
import adsRoutes from "#src/routes/adsRoutes.js";
import aiRoutes from "#src/routes/aiRoutes.js";
import twitterRoutes from "#src/routes/twitterRoutes.js";
import blumRoutes from "#src/routes/blumRoutes.js";
import {Application, Request, Response} from "express";
import idaoRoutes from "#src/routes/idaoRoutes.js";
import dawnRoutes from "#src/routes/dawnRoutes.js";
import authRoutes from "#src/routes/authRoutes.js";
import {authMiddleware} from "#src/middlewares/authMiddleware.js";
import userRoutes from "#src/routes/userRoutes.js";
import userAppSettingsRoutes from "#src/routes/userAppSettingsRoutes.js";
import adsPowerAddressRoutes from "#src/routes/adsPowerAddressRoutes.js";

const initRoutes = (app: Application) => {
  app.use('/auth', authRoutes)
  app.use('/rcade', [authMiddleware], rcadeRoutes);
  app.use('/swan', [authMiddleware], swanRoutes);
  app.use('/jobs', [authMiddleware], jobRoutes);
  app.use('/ads', [authMiddleware], adsRoutes)
  app.use('/ai', [authMiddleware], aiRoutes);
  app.use('/twitter', [authMiddleware], twitterRoutes);
  app.use('/blum', [authMiddleware], blumRoutes);
  app.use('/idao', [authMiddleware], idaoRoutes);
  app.use('/dawn', [authMiddleware], dawnRoutes);
  app.use('/user', [authMiddleware], userRoutes);
  app.use('/userAppSetting', [authMiddleware], userAppSettingsRoutes);
  app.use('/adsPowerAddress', [authMiddleware], adsPowerAddressRoutes);

  app.get('/status', async (_req: Request, res: Response) => {
    res.send('OK');
  });
};

export default initRoutes;
