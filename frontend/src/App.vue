<script setup>
import useProfilesStore from 'src/stores/useProfilesStore';
import useProfileGroupsStore from 'src/stores/useProfileGroupsStore';

defineOptions({
  name: 'App',
});

const profilesStore = useProfilesStore();
const profileGroupsStore = useProfileGroupsStore();

profilesStore.loadProfiles();
profileGroupsStore.loadGroups();
</script>

<template>
  <router-view/>
</template>
