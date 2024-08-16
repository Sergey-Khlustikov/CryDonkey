import { defineStore } from 'pinia'
import { ref } from 'vue'
import AdsApi from 'src/api/AdsApi'

export const useProfileGroupsStore = defineStore('profileGroups', () => {
  const groups = ref([])

  const loadGroups = async () => {
    try {
      groups.value = await AdsApi.getGroups()
    } catch (e) {
      console.log(e)
    }
  }

  return {
    groups,
    loadGroups
  }
})
