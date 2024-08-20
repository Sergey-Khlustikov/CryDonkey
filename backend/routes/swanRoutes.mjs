import express from 'express';
import shuffleArray from '../automatization/helpers/shuffleArray.mjs';
import {run as runSwan} from '../automatization/swan/swan.mjs';

const router = express.Router();

router.post('/runSwan', async (req, res) => {
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

export default router;
