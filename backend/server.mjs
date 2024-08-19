import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { run as runRcade } from 'backend/automatization/rcade/rcade.mjs';
import { run as runSwan } from 'backend/automatization/swan/swan.mjs';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.get('/status', async (req, res) => {
  res.send('Everything is OK');
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
      .send(process.env.VUE_APP_ADS_API_URL);
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

export default app;
