<script setup>
const props = defineProps({
  profiles: {
    type: Array,
    required: true,
  },
});

const model = defineModel({type: Array});
</script>

<template>
  <q-checkbox v-for="profile in profiles" v-model="model" :label="profile.name" :val="profile.user_id"></q-checkbox>
</template>
