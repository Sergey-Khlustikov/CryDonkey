<script setup lang="ts">
import { date, type QTableColumn } from 'quasar';
import JobStatusLabel from 'src/pages/jobs/components/JobStatusLabel.vue';
import EJobStatuses from 'src/domains/jobs/structures/job-statuses.enum.js';
import Timer from 'src/components/Timer.vue';
import JobActions from 'src/pages/jobs/components/JobActions.vue';
import AdsPowerController from 'src/domains/ads-power/controllers/ads-power.controller.js';
import type { IProjectJob } from 'src/domains/jobs/structures/project-job.interface.js';
import type { IJobActionsEmits } from 'pages/jobs/components/JobActions.vue';

defineOptions({
  name: 'JobsTable',
});

interface Props {
  jobs: IProjectJob[];
  loading?: boolean;
}

const { loading = false } = defineProps<Props>();

const emit = defineEmits<IJobActionsEmits>();

const columns: QTableColumn[] = [
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
    field: '',
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
    label: '',
    field: '',
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
    :rows="jobs"
    :columns="columns"
    :pagination="pagination"
    row-key="serial_number"
    style="max-height: 80vh"
    virtual-scroll
    :loading="loading"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template #body-cell-profile="props">
      <q-td :props="props">
        <div>Name: {{ props.row.data.profile.name }}</div>
        <div>ID: {{ props.row.data.profile.id }}</div>
        <q-btn
          @click="AdsPowerController.openAdsProfile(props.row.data.profile.id)"
          color="primary"
          size="xs"
          label="Open"
        ></q-btn>
      </q-td>
    </template>

    <template #body-cell-status="props">
      <q-td :props="props">
        <job-status-label :status="props.row.status">
          <q-tooltip v-if="props.row.status === EJobStatuses.Failed">
            {{ props.row.failedReason }}
          </q-tooltip>
        </job-status-label>
        <timer
          v-if="props.row.status === EJobStatuses.Delayed"
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
