<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ROUTE_NAMES from 'src/router/structures/routeNames';
import vRequired from 'src/helpers/validations/vRequired';
import useAuthStore from 'src/stores/useAuthStore';

const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const router = useRouter();

const onLogin = async () => {
  await authStore.login(username.value, password.value);
  await router.push({ name: ROUTE_NAMES.profiles });
};
</script>

<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">

        <q-card style="max-width: 100%; width: 400px" class="q-pa-md">
          <q-card-section>
            <div class="text-h6">Login</div>
          </q-card-section>

          <q-card-section>
            <q-form no-error-focus greedy @submit="onLogin">
              <q-input v-model="username" label="Username" outlined dense :rules="[vRequired]"/>
              <q-input
                v-model="password"
                type="password"
                label="Password"
                outlined
                dense
                :rules="[vRequired]"
              />
              <q-btn type="submit" label="Login" color="primary" class="q-mt-md"/>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
