import { api } from 'src/boot/axios';

class AIController {
  constructor() {
    this.api = api;
  }

  async generate(prompt) {
    const response = await this.api.post('/open-ai/generate-message', { prompt });

    return response.data.data;
  }
}

export default new AIController();
