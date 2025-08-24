<script setup lang="ts">
import ArrowBtn from 'src/components/ArrowBtn.vue';
import { ref } from 'vue';

defineProps({
  headerText: {
    type: String,
    default: '',
  },
});

const expanded = ref(true);
</script>

<template>
  <q-card bordered>
    <q-card-section @click="expanded = !expanded" class="flex justify-between items-center cursor-pointer">
      <div class="text-h6">{{ headerText }}</div>
      <q-space/>

      <arrow-btn :model-value="expanded"></arrow-btn>
    </q-card-section>

    <q-slide-transition>
      <div v-show="expanded">
        <q-separator></q-separator>

        <slot></slot>
      </div>
    </q-slide-transition>
  </q-card>
</template>
