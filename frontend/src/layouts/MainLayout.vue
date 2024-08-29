<script setup>
import { ref } from 'vue';
import EssentialLink from 'src/components/EssentialLink.vue';
import ROUTE_NAMES from 'src/router/structures/routeNames';

defineOptions({
  name: 'MainLayout',
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
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
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
