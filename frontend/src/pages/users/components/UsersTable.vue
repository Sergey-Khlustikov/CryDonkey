<script setup lang="ts">
import { ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { date, useQuasar } from 'quasar';
import UserController from 'src/domains/user/controllers/user.controller.js';
import type { IUser } from 'src/domains/user/structures/user.interface.js';

const $q = useQuasar();

const emit = defineEmits<{
  userRemoved: [user: IUser];
}>();

interface Props {
  users: IUser[];
  loading?: boolean;
}

const { loading = false } = defineProps<Props>();

const columns: QTableColumn[] = [
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
    label: '',
    field: '',
    align: 'right',
    headerStyle: 'width: 100px',
  },
];

const pagination = {
  rowsPerPage: 0,
};

const showDeletingAlert = ref(false);

const deleteUser = (user: IUser): void => {
  $q.dialog({
    title: 'Delete user',
    message: `Are you sure you want to delete user ${user.username}?`,
    persistent: true,
    ok: {
      label: 'Delete',
      color: 'negative',
    },
    cancel: {
      color: 'primary',
    },
  }).onOk(() => {
    void (async () => {
      await UserController.delete(user.id);
      emit('userRemoved', user);
    })();
  });
};
</script>

<template>
  <q-dialog v-model="showDeletingAlert" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
        <span class="q-ml-sm">You are currently not connected to any network.</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Turn on Wifi" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-table
    title="Users"
    :rows="users"
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
