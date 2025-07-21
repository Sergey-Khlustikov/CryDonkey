<script setup lang="ts">
import useAuthStore from 'src/stores/useAuthStore';

defineOptions({
  name: 'App',
});

useAuthStore();
</script>

<template>
  <router-view/>
</template>
