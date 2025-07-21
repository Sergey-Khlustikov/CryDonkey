<script setup>
import JOB_STATUSES from 'src/domains/jobs/structures/jobStatuses';
import JobsController from 'src/domains/jobs/JobsController';

const props = defineProps({
  job: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['jobRemoved', 'jobRetried']);

const retryJob = async () => {
  await JobsController.retry(props.job.id, props.job.name);
  emit('jobRetried', { id: props.job.id, queueName: props.job.name });
};

const removeJob = async () => {
  await JobsController.remove(props.job.id, props.job.name);
  emit('jobRemoved', { id: props.job.id, queueName: props.job.name });
};
</script>

<template>
  <div>
    <q-btn
      v-if="props.job.status === JOB_STATUSES.failed"
      @click="retryJob"
      color="green"
      class="q-ml-sm"
      size="sm"
    >
      <q-icon name="refresh"></q-icon>
    </q-btn>
    <q-btn
      v-if="props.job.status !== JOB_STATUSES.active"
      @click="removeJob"
      color="red"
      class="q-ml-sm"
      size="sm"
    >
      <q-icon name="delete"></q-icon>
    </q-btn>
  </div>
</template>
