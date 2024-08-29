import OpenAI from 'openai';

class OpenAIApi {
  constructor() {
    this.api = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    this.model = 'gpt-4o-mini';
  }

  async generateMessage(userMessage) {
    const completion = await this.api.chat.completions.create({
      model: this.model,
      messages: [{
        role: 'user',
        content: userMessage,
      }],
    });

    return completion.choices[0].message.content;
  }
}

export default new OpenAIApi();
