<script setup>
import { ref } from 'vue';
import { date, useQuasar } from 'quasar';
import UserController from 'src/domains/user/controllers/UserController';

const $q = useQuasar();

const emit = defineEmits(['userRemoved']);

const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const columns = [
  {
    name: 'username',
    label: 'Username',
    field: 'username',
    align: 'left',
    headerStyle: 'width: 150px',
  },
  {
    name: 'role',
    label: 'Role',
    field: 'role',
    sortable: true,
    align: 'left',
    headerStyle: 'width: 150px',
  },
  {
    name: 'createdAt',
    label: 'Created at',
    field: 'createdAt',
    sortable: true,
    align: 'left',
    format: (val) => date.formatDate(val, 'MM.DD.YYYY HH:mm'),
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

const showDeletingAlert = ref(false);

const deleteUser = (row) => {
  $q.dialog({
    title: 'Delete user',
    message: `Are you sure you want to delete user ${row.username}?`,
    persistent: true,
    ok: {
      label: 'Delete',
      color: 'negative',
    },
    cancel: {
      color: 'primary',
    },
  }).onOk(async () => {
    await UserController.delete(row.id);
    emit('userRemoved', row);
  });
};
</script>

<template>
  <q-dialog v-model="showDeletingAlert" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="signal_wifi_off" color="primary" text-color="white"/>
        <span class="q-ml-sm">You are currently not connected to any network.</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup/>
        <q-btn flat label="Turn on Wifi" color="primary" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-table
    title="Users"
    :rows="props.users"
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

    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn-dropdown dropdown-icon="more_horiz" flat rounded>
          <q-list>
            <q-item clickable v-close-popup @click="deleteUser(props.row)">
              <q-item-section side>
                <q-icon name="delete" color="red"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Delete</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-td>
    </template>
  </q-table>
</template>
