<script setup>
import { onBeforeMount, ref } from 'vue';
import EssentialLink from 'src/components/EssentialLink.vue';
import ROUTE_NAMES from 'src/router/structures/routeNames';
import useAuthStore from 'src/stores/useAuthStore';
import useUserStore from 'src/stores/useUserStore';

defineOptions({
  name: 'MainLayout',
});

const authStore = useAuthStore();
const userStore = useUserStore();

onBeforeMount(async () => {
  await userStore.loadUser();
});

const linksList = [
  {
    title: 'Profiles',
    icon: 'fact_check',
    routeName: ROUTE_NAMES.profiles,
  },
  {
    title: 'Queue Jobs',
    icon: 'queue',
    routeName: ROUTE_NAMES.jobs,
  },
  {
    title: 'Users',
    icon: 'people_outline',
    routeName: ROUTE_NAMES.users,
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const onLogout = async () => {
  await authStore.logout();
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          CryDonkey
        </q-toolbar-title>

        <q-btn-dropdown dropdown-icon="person" no-icon-animation :label="userStore.username" flat>
          <q-list>
            <q-item :to="{name: ROUTE_NAMES.userSettings}" clickable v-close-popup>
              <q-item-section side>
                <q-icon name="settings"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Settings</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list>
            <q-item @click="onLogout" clickable v-close-popup>
              <q-item-section side>
                <q-icon name="logout"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Navigation
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>
