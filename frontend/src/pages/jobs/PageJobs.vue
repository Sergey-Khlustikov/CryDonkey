<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import JobsController from 'src/domains/jobs/controllers/jobs.controller.js';
import JobsTable from 'src/pages/jobs/components/JobsTable.vue';
import type { IProjectJob } from 'src/domains/jobs/structures/project-job.interface.js';
import type { IJobsRemovedPayload } from 'pages/jobs/components/JobActions.vue';

const jobs = ref<IProjectJob[]>([]);
const loading = ref(false);

const getJobs = async () => {
  try {
    loading.value = true;

    jobs.value = await JobsController.getList();
  } finally {
    loading.value = false;
  }
};

onBeforeMount(async () => {
  await getJobs();
});

const deleteJobs = async () => {
  await JobsController.deleteAll();
  await getJobs();
};

const retryFailed = async () => {
  await JobsController.retryFailed();
  await getJobs();
};

const onJobRemoved = ({ id, queueName }: IJobsRemovedPayload) => {
  jobs.value = jobs.value.filter(job => {
    return !(job.id === id && job.name === queueName);
  });
};
</script>

<template>
  <q-page padding>
    <div class="filters flex justify-between q-mb-md">
      <div class="flex q-mb-md">
        <q-btn
          @click="retryFailed"
          color="green"
          :disable="!jobs.length"
          class="q-ml-sm"
          label="Retry Failed"
        ></q-btn>

        <q-btn
          @click="deleteJobs"
          color="red"
          :disable="!jobs.length"
          class="q-ml-sm"
          label="Delete all"
        ></q-btn>
        <q-btn @click="getJobs" color="primary" class="q-ml-sm">
          <q-icon name="refresh"></q-icon>
        </q-btn>
      </div>
    </div>

    <jobs-table :jobs="jobs" :loading="loading" @job-removed="onJobRemoved"></jobs-table>
  </q-page>
</template>
