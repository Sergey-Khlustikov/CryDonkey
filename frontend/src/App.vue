<script setup>
import useAuthStore from 'src/stores/useAuthStore';

defineOptions({
  name: 'App',
});

useAuthStore();
</script>

<template>
  <router-view/>
</template>
