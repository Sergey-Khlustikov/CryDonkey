<script setup>
import ArrowBtn from 'src/components/ArrowBtn.vue';
import {ref} from 'vue';

const dailyCombo = defineModel('dailyCombo');
const onlyDaily = defineModel('onlyDaily');

const expanded = ref(true);
</script>

<template>
  <q-card bordered>
    <q-card-section @click="expanded = !expanded" class="flex justify-between items-center cursor-pointer">
      <div class="text-h6">Daily Task</div>
      <q-space/>

      <arrow-btn :model-value="expanded"></arrow-btn>
    </q-card-section>

    <q-slide-transition>
      <div v-show="expanded">
        <q-separator></q-separator>

        <q-card-section>
          <q-checkbox v-model="onlyDaily" label="Only daily task" class="q-mb-md"></q-checkbox>

          <div class="row no-wrap q-col-gutter-md">
            <q-input
              filled
              v-model="dailyCombo.first"
              label="First number"
              lazy-rules
              :rules="[ val => val !== null && val.length > 0]"
              type="number"
            ></q-input>
            <q-input
              filled
              v-model="dailyCombo.second"
              label="Second number"
              lazy-rules
              :rules="[ val => val !== null && val.length > 0]"
              type="number"
            ></q-input>
            <q-input
              filled
              v-model="dailyCombo.third"
              label="Third number"
              lazy-rules
              :rules="[ val => val !== null && val.length > 0]"
              type="number"
            ></q-input>
          </div>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>
