import { api } from 'boot/axios.js';
import type { RTwitterWritePost } from 'src/domains/twitter/requests/twitter.write-post.request.js';

class TwitterController {
  async writePost(params: RTwitterWritePost): Promise<void> {
    await api.post('/twitter/write-post', params);
  }
}

export default new TwitterController();
