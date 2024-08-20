<script setup>
import { computed } from 'vue';
import { useProfileGroupsStore } from 'src/stores/useProfileGroupsStore';

const model = defineModel({ type: [String, Object] });
const store = useProfileGroupsStore();

const options = computed(() => {
  return [
    {
      label: 'All',
      value: null,
    },
    ...store.groups.map(group => {
      return {
        label: group.group_name,
        value: group.group_id,
      };
    }),
  ];
});
</script>

<template>
  <q-select filled v-model="model" :options="options" label="Group"/>
</template>
