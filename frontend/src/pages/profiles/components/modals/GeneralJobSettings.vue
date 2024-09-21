<script setup>
import {ref} from 'vue';
import ArrowBtn from 'src/components/ArrowBtn.vue';
import DontCloseProfiles from 'src/pages/profiles/components/DontCloseProfiles.vue';

const model = defineModel();

const props = defineProps({
  profiles: {
    type: Array,
    required: true,
  },
});

const expanded = ref(true);
</script>

<template>
  <q-card bordered>
    <q-card-section @click="expanded = !expanded" class="flex justify-between items-center cursor-pointer">
      <div class="text-h6">General settings</div>
      <q-space/>

      <arrow-btn :model-value="expanded"></arrow-btn>
    </q-card-section>

    <q-slide-transition>
      <div v-show="expanded">
        <q-separator></q-separator>

        <q-card-section>
          <dont-close-profiles v-model="model.keepOpenProfileIds" :profiles="profiles"></dont-close-profiles>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<style scoped>

</style>
