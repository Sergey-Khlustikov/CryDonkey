import BlumQueue from '../queues/BlumQueue.mjs';
import BlumRunDTO from '../dto/BlumRunDTO.mjs';
import shuffleArray from '../../../../automatization/helpers/shuffleArray.mjs';

class BlumController {
  async run(req, res) {
    try {
      const params = req.body;

      await BlumQueue.addJobs(new BlumRunDTO({
        profiles: shuffleArray(params.profiles),
        minDelayMinutes: params.minDelayMinutes || 1,
        maxDelayMinutes: params.maxDelayMinutes || 5,
        keepOpenProfileIds: params.keepOpenProfileIds,
      }));

      res.status(200).send({message: 'Success'});
    } catch (error) {
      res.status(500).send({message: error.message});
    }
  }
}

export default new BlumController();
