<script setup lang="ts">
import AdsPowerController from 'src/domains/ads-power/controllers/ads-power.controller.js';
import type { QTableColumn } from 'quasar';
import type { IAdsPowerProfile } from 'src/domains/ads-power/structures/ads-power-profile.interface.js';

defineOptions({
  name: 'ProfilesTable',
});

defineProps<{ profiles: IAdsPowerProfile[] }>();

const model = defineModel({ type: Array });

const columns: QTableColumn[] = [
  {
    name: 'id',
    label: 'ID',
    field: 'serial_number',
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
    headerStyle: 'width: 200px',
  },
  {
    name: 'group',
    label: 'Group',
    field: 'group_name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'actions',
    field: '',
    label: 'Actions',
    align: 'right',
  },
];

const pagination = {
  rowsPerPage: 0,
};
</script>

<template>
  <q-table
    title="Profiles"
    :rows="profiles"
    :columns="columns"
    :pagination="pagination"
    row-key="serial_number"
    v-model:selected="model"
    selection="multiple"
    style="max-height: 80vh"
    virtual-scroll
  >
    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          @click="AdsPowerController.openAdsProfile(props.row.user_id)"
          color="primary"
          label="Open"
        ></q-btn>
      </q-td>
    </template>
  </q-table>
</template>
