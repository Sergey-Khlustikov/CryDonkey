<script setup lang="ts">
import { useAuthStore } from 'stores/auth.store.js';

defineOptions({
  name: 'App',
});

useAuthStore();
</script>

<template>
  <router-view/>
</template>
