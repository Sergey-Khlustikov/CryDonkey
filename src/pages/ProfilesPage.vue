<script setup>
import { useProfilesStore } from 'stores/useProfilesStore'
import ProfilesTable from 'components/ProfilesTable.vue'
import ProfileGroupsSelect from 'components/ProfileGroupsSelect.vue'
import { computed, ref } from 'vue'
import Api from 'src/api/Api.js'
import { useQuasar } from 'quasar'
import SwanModal from 'components/modals/SwanModal.vue'

const $q = useQuasar()

defineOptions({
  name: 'ProfilesPage'
})

const profilesStore = useProfilesStore()

const selectedProfiles = ref([])
const selectedGroup = ref()

const filteredProfiles = computed(() => {
  if (!selectedGroup.value || !selectedGroup.value.value) {
    return profilesStore.profiles
  }

  return profilesStore.profiles.filter(profile => profile.group_id === selectedGroup.value.value)
})

async function runRcade () {
  await Api.runRcade(selectedProfiles.value.map(profile => profile.user_id))
}

function openSwanModal () {
  $q.dialog({
    component: SwanModal,
    componentProps: {
      profileIds: selectedProfiles.value.map(profile => profile.user_id)
    }
  })
}
</script>

<template>
  <q-page padding>
    <div class="filters flex q-mb-md">
      <profile-groups-select v-model="selectedGroup" style="width: 300px"></profile-groups-select>
      <q-btn
        @click="runRcade"
        color="primary"
        :disable="!selectedProfiles.length"
        class="q-ml-sm"
        label="Run Rcade"
      ></q-btn>

      <q-btn
        @click="openSwanModal"
        color="primary"
        :disable="!selectedProfiles.length"
        class="q-ml-sm"
        label="Run Swan"
      ></q-btn>
    </div>

    <profiles-table v-model="selectedProfiles" :profiles="filteredProfiles"></profiles-table>
  </q-page>
</template>
