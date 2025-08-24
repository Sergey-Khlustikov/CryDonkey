<script setup lang="ts">
import EJobStatuses from 'src/domains/jobs/structures/job-statuses.enum.js';
import JobsController from 'src/domains/jobs/controllers/jobs.controller.js';
import type { IProjectJob } from 'src/domains/jobs/structures/project-job.interface.js';
import type { EQueueNames } from '@crydonkey/shared';

interface Props {
  job: IProjectJob;
}

const props = defineProps<Props>();

export interface IJobsPageRetriedPayload {
  id: string;
  queueName: EQueueNames,
}

export interface IJobsRemovedPayload {
  id: string;
  queueName: EQueueNames,
}

export interface IJobActionsEmits {
  jobRetried: [IJobsPageRetriedPayload],
  jobRemoved: [IJobsRemovedPayload],
}

const emit = defineEmits<IJobActionsEmits>();

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
      v-if="props.job.status === EJobStatuses.Failed"
      @click="retryJob"
      color="green"
      class="q-ml-sm"
      size="sm"
    >
      <q-icon name="refresh"></q-icon>
    </q-btn>
    <q-btn
      v-if="props.job.status !== EJobStatuses.Active"
      @click="removeJob"
      color="red"
      class="q-ml-sm"
      size="sm"
    >
      <q-icon name="delete"></q-icon>
    </q-btn>
  </div>
</template>
