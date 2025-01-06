<script setup>
import { onBeforeMount, ref } from 'vue';
import JobsController from 'src/domains/jobs/JobsController';
import JobsTable from 'src/pages/jobs/components/JobsTable.vue';

const jobs = ref([]);
const loading = ref(false);

const getJobs = async () => {
  try {
    loading.value = true;

    jobs.value = await JobsController.getList();
  } finally {
    loading.value = false;
  }
};

onBeforeMount(() => {
  getJobs();
});

const deleteJobs = async () => {
  await JobsController.deleteAll();
  await getJobs();
};

const retryFailed = async () => {
  await JobsController.retryFailed();
  await getJobs();
};

const onJobRemoved = ({ id, queueName }) => {
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
