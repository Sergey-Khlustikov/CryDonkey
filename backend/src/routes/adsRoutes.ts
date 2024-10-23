// @ts-nocheck
import express from 'express';
import AdsPowerService from "#src/domains/ads/services/AdsPowerService.js";

const router = express.Router();

router.get('/openProfile', async (req, res) => {
  const profileId = req.query.profileId;

  try {
    await AdsPowerService.openProfile(profileId);
    res.status(200).send('success');
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/getProfiles', async (req, res) => {
  try {
    const response = await AdsPowerService.getProfiles(req.query);
    res.status(200).json(response);
  } catch (e) {
    res.status(500).send(e);
  }
})

router.get('/getGroups', async (req, res) => {
  try {
    const response = await AdsPowerService.getGroups(req.query);
    res.status(200).json(response);
  } catch (e) {
    res.status(500).send(e);
  }
})

export default router;
