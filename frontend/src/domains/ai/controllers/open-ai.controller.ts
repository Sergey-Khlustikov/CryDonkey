import { api } from 'boot/axios.js';

class OpenAIController {
  async generate(prompt: string): Promise<string> {
    const response = await api.post('/open-ai/generate-message', { prompt });

    return response.data.data;
  }
}

export default new OpenAIController();
