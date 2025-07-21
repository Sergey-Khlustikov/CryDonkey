<script setup>
import { onMounted, reactive, watch } from 'vue';
import CollapsableModalSection from 'src/components/modals/CollapsableModalSection.vue';

const emit = defineEmits(['update:modelValue']);

const options = reactive({
  playGame: true,
});

onMounted(() => {
  emit('update:modelValue', options);
});

watch(options, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<template>
  <collapsable-modal-section header-text="Settings">
    <q-card-section>
      <q-checkbox v-model="options.playGame" label="Play game"></q-checkbox>
    </q-card-section>
  </collapsable-modal-section>
</template>
