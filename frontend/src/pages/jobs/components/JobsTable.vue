<script setup>
import { date } from 'quasar';
import JobStatusLabel from 'src/pages/jobs/components/JobStatusLabel.vue';
import JOB_STATUSES from 'src/domains/jobs/structures/jobStatuses';
import Timer from 'src/components/Timer.vue';
import JobActions from 'src/pages/jobs/components/JobActions.vue';
import AdsController from 'src/domains/ads/AdsController';

defineOptions({
  name: 'JobsTable',
});

const props = defineProps({
  jobs: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['jobRemoved', 'jobRetried']);

const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    sortable: true,
    sort: (a, b) => Number(a) - Number(b),
    align: 'left',
    headerStyle: 'width: 50px',
  },
  {
    name: 'name',
    label: 'Name',
    align: 'left',
    field: 'name',
    sortable: true,
    headerStyle: 'width: 100px',
  },
  {
    name: 'profile',
    label: 'Profile',
    align: 'left',
    headerStyle: 'width: 100px',
  },
  {
    name: 'processedOn',
    label: 'Started at',
    field: 'processedOn',
    sortable: true,
    align: 'left',
    format: (val) => date.formatDate(val, 'MM.DD HH:mm:ss'),
    headerStyle: 'width: 100px',
  },
  {
    name: 'finishedOn',
    label: 'Finished on',
    field: 'finishedOn',
    sortable: true,
    align: 'left',
    format: (val) => date.formatDate(val, 'MM.DD HH:mm:ss'),
    headerStyle: 'width: 100px',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    sortable: true,
    align: 'right',
  },
  {
    name: 'actions',
    align: 'right',
    headerStyle: 'width: 100px',
  },
];

const pagination = {
  rowsPerPage: 0,
};

</script>

<template>
  <q-table
    title="Jobs"
    :rows="props.jobs"
    :columns="columns"
    :pagination="pagination"
    row-key="serial_number"
    style="max-height: 80vh;"
    virtual-scroll
    :loading="loading"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary"/>
    </template>

    <template #body-cell-profile="props">
      <q-td :props="props">
        <div>Name: {{ props.row.data.profile.name }}</div>
        <div>ID: {{ props.row.data.profile.id }}</div>
        <q-btn
          @click="AdsController.openAdsProfile(props.row.data.profile.id)"
          color="primary"
          size="xs"
          label="Open"
        ></q-btn>
      </q-td>
    </template>

    <template #body-cell-status="props">
      <q-td :props="props">
        <job-status-label :status="props.row.status">
          <q-tooltip v-if="props.row.status === JOB_STATUSES.failed">
            {{ props.row.failedReason }}
          </q-tooltip>
        </job-status-label>
        <timer
          v-if="props.row.status === JOB_STATUSES.delayed"
          :delay="props.row.opts.delay"
          :timestamp="props.row.timestamp"
        ></timer>
      </q-td>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props">
        <job-actions
          :job="props.row"
          @job-removed="emit('jobRemoved', $event)"
          @job-retried="emit('jobRetried', $event)"
        ></job-actions>
      </q-td>
    </template>
  </q-table>
</template>
