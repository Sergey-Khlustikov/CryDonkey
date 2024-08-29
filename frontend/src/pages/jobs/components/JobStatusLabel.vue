<script setup>
import { computed } from 'vue';
import JOB_STATUSES from 'src/domains/jobs/structures/jobStatuses';

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
});

const title = computed(() => {
  switch (props.status) {
    case JOB_STATUSES.completed:
      return 'Completed';

    case JOB_STATUSES.failed:
      return 'Failed';

    case JOB_STATUSES.active:
      return 'Active';

    case JOB_STATUSES.delayed:
      return 'Delayed';

    default:
      return props.status;
  }
});

const color = computed(() => {
  switch (props.status) {
    case JOB_STATUSES.completed:
      return 'green';

    case JOB_STATUSES.failed:
      return 'red';

    case JOB_STATUSES.active:
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
