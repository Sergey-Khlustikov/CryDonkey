import axios from 'axios'

class AdsApi {
  constructor () {
    this.api = axios.create({
      baseURL: 'http://local.adspower.net:58581/api/v1/'
    })
  }

  async getProfiles (params) {
    try {
      params = params || {
        page_size: 1000
      }

      const response = await this.api.get('user/list', { params })

      return response.data.data.list
    } catch (e) {
      console.log('getProfiles catch', e)
    }
  }

  async getGroups (params) {
    try {
      params = params || {
        page_size: 50
      }

      const response = await this.api.get('group/list', { params })

      return response.data.data.list
    } catch (e) {
      console.log('getGroups catch', e)
    }
  }

  async openProfile (profileId) {
    try {
      const response = await this.api.get('browser/start', { params: { user_id: profileId } })

      return response.data
    } catch (e) {
      console.log('openProfile catch', e)
    }
  }
}

export default new AdsApi()
