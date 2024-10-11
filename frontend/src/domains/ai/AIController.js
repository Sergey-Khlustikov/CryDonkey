import { api } from 'src/boot/axios';

class AIController {
  constructor() {
    this.api = api;
  }

  async generate(message) {
    const response = await this.api.post('/ai/generate', { message });

    return response.data;
  }
}

export default new AIController();
