import './loadEnv.mjs';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rcadeRoutes from './routes/rcadeRoutes.mjs';
import swanRoutes from './routes/swanRoutes.mjs';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use('/', rcadeRoutes)
app.use('/', swanRoutes)

mongoose.connect(process.env.ATLAS_URI)
  .then(db => console.log('[OK] DB is connected'))
  .catch(err => console.error(err));

app.get('/status', async (req, res) => {
  res.send('Everything is OK');
});

app.listen(process.env.EXPRESS_SERVER_PORT, () => {
  console.log(`Listening on ${process.env.EXPRESS_SERVER_PORT}`);
});
