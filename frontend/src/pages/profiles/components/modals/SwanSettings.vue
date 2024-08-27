<script setup>
import SwanDailyCombo from 'src/pages/profiles/components/modals/SwanDailyCombo.vue';
import {reactive, watch} from 'vue';
import SwanComments from 'src/pages/profiles/components/modals/SwanComments.vue';

const props = defineProps({
  profiles: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const settings = reactive({
  onlyDaily: false,
  dailyCombo: {},
});

watch(settings, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<template>
  <div>
    <q-checkbox v-model="settings.onlyDaily" label="Only daily task"></q-checkbox>
    <swan-daily-combo v-model="settings.dailyCombo"></swan-daily-combo>
    <q-separator class="q-mb-md"></q-separator>
    <swan-comments :profiles="profiles"></swan-comments>
  </div>
</template>
