import OpenAIApi from '../../../api/OpenAIApi';
import {Request, Response} from 'express';

class AIController {
  async generate(req: Request, res: Response): Promise<void> {
    try {
      const prompt = req.body.message;

      const response = await OpenAIApi.generateMessage(prompt);

      res.status(200).json(response);
    } catch (e) {
      res.status(500).json({message: e});
    }
  }
}

export default new AIController();
