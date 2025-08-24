<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { reactive, ref } from 'vue';
import vRequired from 'src/helpers/validators/required.validator.js';
import { USER_ROLES_SELECT_OPTIONS } from 'src/domains/user/structures/user-roles.enum.js';
import UserController from 'src/domains/user/controllers/user.controller.js';
import type { RUserCreate } from 'src/domains/user/requests/user-create.request.js';

const props = defineProps({
  onUserAdded: {
    type: Function,
    required: true,
  },
});

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

const userData: RUserCreate = reactive({
  username: '',
  password: '',
  role: '',
});

const showPassword = ref(false);
const loading = ref(false);

const onSubmit = async (): Promise<void> => {
  try {
    loading.value = true;

    await UserController.create(userData);
    props.onUserAdded();

    onDialogOK();
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 600px; max-width: 80vw">
      <div class="text-h6 q-ml-md q-mt-md">Adding user</div>

      <q-form @submit="onSubmit" no-error-focus greedy>
        <q-card-section>
          <q-input
            v-model="userData.username"
            outlined
            stack-label
            label="Username"
            :rules="[vRequired]"
          ></q-input>

          <q-input
            v-model="userData.password"
            outlined
            stack-label
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            :rules="[vRequired]"
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-select
            outlined
            stack-label
            v-model="userData.role"
            :options="USER_ROLES_SELECT_OPTIONS"
            emit-value
            map-options
            label="Role"
            :rules="[vRequired]"
          ></q-select>
        </q-card-section>

        <q-card-actions align="right" class="q-mr-sm q-mb-sm">
          <q-btn color="primary" label="Cancel" @click="onDialogCancel"></q-btn>
          <q-btn color="positive" label="Add" type="submit" :loading="loading"></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
