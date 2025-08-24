<script setup lang="ts">
import { computed } from 'vue';
import EJobStatuses from 'src/domains/jobs/structures/job-statuses.enum.js';

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
});

const title = computed(() => {
  switch (props.status) {
    case EJobStatuses.Completed:
      return 'Completed';

    case EJobStatuses.Failed:
      return 'Failed';

    case EJobStatuses.Active:
      return 'Active';

    case EJobStatuses.Delayed:
      return 'Delayed';

    default:
      return props.status;
  }
});

const color = computed(() => {
  switch (props.status) {
    case EJobStatuses.Completed:
      return 'green';

    case EJobStatuses.Failed:
      return 'red';

    case EJobStatuses.Active:
      return 'primary';

    default:
      return 'orange';
  }
});
</script>

<template>
  <q-badge :color="color">
    {{ title }}
    <slot></slot>
  </q-badge>
</template>
