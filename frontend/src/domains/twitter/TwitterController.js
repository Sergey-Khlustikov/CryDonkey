import {api} from 'src/boot/axios';

class TwitterController {
  constructor() {
    this.api = api;
  }

  async writePost(params) {
    return this.api.post(`/twitter/writePost`, params);
  }
}

export default new TwitterController();
