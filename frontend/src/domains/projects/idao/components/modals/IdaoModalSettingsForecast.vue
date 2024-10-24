<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import ArrowBtn from 'src/components/ArrowBtn.vue';
import vRequired from 'src/helpers/validations/vRequired';
import vMoreThan from 'src/helpers/validations/vMoreThan';
import vLessOrEqualThan from 'src/helpers/validations/vLessOrEqualThan';

const forecastOptions = reactive({
  minTargetPriceDeviation: 0,
  maxTargetPriceDeviation: 1,
});

const expanded = ref(true);
const emit = defineEmits(['update:modelValue']);

onMounted(() => {
  emit('update:modelValue', forecastOptions);
});

watch(forecastOptions, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<template>
  <q-card bordered>
    <q-card-section @click="expanded = !expanded" class="flex justify-between items-center cursor-pointer">
      <div class="text-h6">Forecast Settings</div>
      <q-space/>

      <arrow-btn :model-value="expanded"></arrow-btn>
    </q-card-section>

    <q-slide-transition>
      <div v-show="expanded">
        <q-separator></q-separator>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <q-input
              v-model.number="forecastOptions.minTargetPriceDeviation"
              outlined
              stack-label
              label="Min target price deviation"
              :rules="[vRequired]"
              type="number"
              step="0.01"
              class="col-4"
            >
              <template v-slot:append>%</template>
            </q-input>

            <q-input
              v-model.number="forecastOptions.maxTargetPriceDeviation"
              outlined
              stack-label
              label="Max target price deviation"
              :rules="[
                vRequired,
                value => vMoreThan(value, forecastOptions.minTargetPriceDeviation),
                value => vLessOrEqualThan(value, 100),
              ]"
              type="number"
              step="0.01"
              class="col-4"
            >
              <template v-slot:append>%</template>
            </q-input>
          </div>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>
