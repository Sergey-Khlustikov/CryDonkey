<script setup lang="ts">
import type { ERouteNames } from 'src/router/structures/route-names.enum.js';

defineOptions({
  name: 'NavigationLink',
});

export interface INavigationLink {
  title: string;
  routeName: ERouteNames;
  icon?: string | undefined;
  caption?: string | undefined;
}

const props = defineProps<INavigationLink>();

</script>

<template>
  <q-item clickable tag="a" :to="props.routeName">
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon"/>
    </q-item-section>

    <q-item-section class="q-mt-sm">
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
