import { defineStore } from 'pinia'
import { ref } from 'vue'
import AdsApi from 'src/api/AdsApi'

export const useProfilesStore = defineStore('profiles', () => {
  const profiles = ref([])

  const loadProfiles = async () => {
    try {
      profiles.value = await AdsApi.getProfiles()
    } catch (e) {
      console.log(e)
    }
  }

  return {
    profiles,
    loadProfiles
  }
})
