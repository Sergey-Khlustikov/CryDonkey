import axios from 'axios'

class Api {
  constructor () {
    this.api = axios.create({
      baseURL: 'http://localhost:3001/'
    })
  }

  async status () {
    return await this.api.get('status')
  }

  async runRcade (profileIds) {
    try {
      await this.api.post('runRcade', { profileIds })
    } catch (e) {
      console.error(e)
    }
  }

  async runSwan ({ profileIds, dailyFirst, dailySecond, dailyThird, onlyDaily }) {
    try {
      await this.api.post('runSwan', { profileIds, dailyFirst, dailySecond, dailyThird, onlyDaily })
    } catch (e) {
      console.error(e)
    }
  }
}

export default new Api()
