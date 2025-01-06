<script setup>
import { onMounted, reactive, watch } from 'vue';
import vRequired from 'src/helpers/validations/vRequired';
import vMoreThan from 'src/helpers/validations/vMoreThan';
import vLessOrEqualThan from 'src/helpers/validations/vLessOrEqualThan';
import CollapsableModalSection from 'src/components/modals/CollapsableModalSection.vue';

const forecastOptions = reactive({
  minTargetPriceDeviation: 0,
  maxTargetPriceDeviation: 1,
});

const emit = defineEmits(['update:modelValue']);

onMounted(() => {
  emit('update:modelValue', forecastOptions);
});

watch(forecastOptions, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<template>
  <collapsable-modal-section header-text="Forecast Settings">
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
  </collapsable-modal-section>
</template>
