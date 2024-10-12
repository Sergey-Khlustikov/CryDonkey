import OpenAIApi from '../../../api/OpenAIApi.mjs';

class AIController {
  async generate(req, res) {
    try {
      const message = req.body.message;

      const response = await OpenAIApi.generateMessage(message);

      res.status(200).json(response);
    } catch (e) {
      req.status(500).json({message: e});
    }
  }
}

export default new AIController();
