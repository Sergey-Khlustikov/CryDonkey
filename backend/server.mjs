import './loadEnv.mjs';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { run as runRcade } from './automatization/rcade/rcade.mjs';
import { run as runSwan } from './automatization/swan/swan.mjs';
import mongoose from 'mongoose';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

mongoose.connect(process.env.ATLAS_URI)
  .then(db => console.log('[OK] DB is connected'))
  .catch(err => console.error(err));

app.get('/status', async (req, res) => {
  res.send('Everything is OK!');
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

app.post('/runRcade', async (req, res) => {
  try {
    await runRcade(shuffleArray(req.body.profileIds));
    res.status(200)
      .send('success');
  } catch (error) {
    res.status(500)
      .send('Error running Rcade: ' + error.message);
  }
});

app.post('/runSwan', async (req, res) => {
  try {
    await runSwan({
      profileIds: shuffleArray(req.body.profileIds),
      dailyFirst: req.body.dailyFirst,
      dailySecond: req.body.dailySecond,
      dailyThird: req.body.dailyThird,
      onlyDaily: req.body.onlyDaily,
    });
    res.status(200)
      .send('Swan run successfully');
  } catch (error) {
    res.status(500)
      .send('Error running Swan: ' + error.message);
  }
});

app.listen(process.env.EXPRESS_SERVER_PORT, () => {
  console.log(`Listening on ${process.env.EXPRESS_SERVER_PORT}`);
});
