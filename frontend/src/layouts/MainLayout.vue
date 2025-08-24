<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import NavigationLink, { type INavigationLink } from 'components/navigation/NavigationLink.vue';
import { ERouteNames } from 'src/router/structures/route-names.enum.js';
import { useAuthStore } from 'stores/auth.store.js';
import { useUserStore } from 'stores/user.store.js';

defineOptions({
  name: 'MainLayout',
});

const authStore = useAuthStore();
const userStore = useUserStore();

onBeforeMount(async () => {
  await userStore.loadUser();
});

const linksList: INavigationLink[] = [
  {
    title: 'Profiles',
    icon: 'fact_check',
    routeName: ERouteNames.Profiles,
  },
  {
    title: 'Queue Jobs',
    icon: 'queue',
    routeName: ERouteNames.Jobs,
  },
  {
    title: 'Users',
    icon: 'people_outline',
    routeName: ERouteNames.Users,
  },
];

const isLeftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  isLeftDrawerOpen.value = !isLeftDrawerOpen.value;
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

        <q-btn-dropdown dropdown-icon="person" no-icon-animation :label="userStore.username || 'User'" flat>
          <q-list>
            <q-item :to="{name: ERouteNames.UserSettings}" clickable v-close-popup>
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

    <q-drawer v-model="isLeftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Navigation
        </q-item-label>

        <navigation-link
          v-for="link in linksList"
          :key="link.title"
          :route-name="link.routeName"
          :title="link.title"
          :icon="link.icon"
        ></navigation-link>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
