<script setup>
import { onBeforeMount, ref } from 'vue';
import UserController from 'src/domains/user/controllers/UserController';
import UsersTable from 'src/pages/users/components/UsersTable.vue';
import AddUserModal from 'src/pages/users/components/modals/AddUserModal.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const users = ref([]);
const loading = ref(false);

const getUsers = async () => {
  try {
    loading.value = true;

    users.value = await UserController.getList();
  } finally {
    loading.value = false;
  }
};

onBeforeMount(() => {
  getUsers();
});

const openAddUserModal = async () => {
  $q.dialog({
    component: AddUserModal,
    componentProps: {
      onUserAdded: getUsers,
    },
  });
};

const onUserRemoved = (user) => {
  users.value = users.value.filter(us => us.id !== user.id);
};
</script>

<template>
  <q-page padding>
    <div class="filters flex justify-between q-mb-md">
      <div class="flex q-mb-md">
        <q-btn
          @click="openAddUserModal"
          color="green"
          class="q-ml-sm"
          label="Add user"
        ></q-btn>

        <q-btn @click="getUsers" :loading="loading" color="primary" class="q-ml-sm">
          <q-icon name="refresh"></q-icon>
        </q-btn>
      </div>
    </div>

    <users-table :users="users" :loading="loading" @user-removed="onUserRemoved"></users-table>
  </q-page>
</template>
