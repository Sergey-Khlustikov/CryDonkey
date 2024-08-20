import express from 'express';
import {run as runRcade} from '../automatization/rcade/rcade.mjs';
import shuffleArray from '../automatization/helpers/shuffleArray.mjs';
const router = express.Router();

router.post('/runRcade', async (req, res) => {
  try {
    await runRcade(shuffleArray(req.body.profileIds));
    res.status(200)
      .send('success');
  } catch (error) {
    res.status(500)
      .send('Error running Rcade: ' + error.message);
  }
});

export default router;
