<script setup lang="ts">
import { computed } from 'vue';
import { useProfileGroupsStore } from 'stores/profile-groups.store.js';
import type { IBaseSelectOption } from 'components/selects/structures/base-select-option.interface.js';

const model = defineModel<IBaseSelectOption['value'] | null>({
  type: [String, Object],
  default: null,
});
const store = useProfileGroupsStore();

const options = computed<IBaseSelectOption[]>(() => {
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
  <q-select filled v-model="model" :options="options" label="Group"></q-select>
</template>
