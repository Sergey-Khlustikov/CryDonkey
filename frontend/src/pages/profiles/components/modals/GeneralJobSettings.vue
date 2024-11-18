<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import ArrowBtn from 'src/components/ArrowBtn.vue';
import DontCloseProfiles from 'src/pages/profiles/components/DontCloseProfiles.vue';
import vRequired from 'src/helpers/validations/vRequired';
import vMoreThan from 'src/helpers/validations/vMoreThan';

const props = defineProps({
  profiles: {
    type: Array,
    required: true,
  },
});

const emits = defineEmits(['update:modelValue']);

const expanded = ref(true);

const settings = reactive({
  keepOpenProfileIds: [],
  minDelayMinutes: 2,
  maxDelayMinutes: 7,
});

onMounted(() => {
  emits('update:modelValue', settings);
});

watch(settings, newSettings => {
  emits('update:modelValue', newSettings);
}, { deep: true });
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
          <dont-close-profiles v-model="settings.keepOpenProfileIds" :profiles="profiles"></dont-close-profiles>
        </q-card-section>

        <q-separator></q-separator>

        <q-card-section>
          <div class="q-mb-md">Set random job delay (minutes)</div>
          <div class="row q-col-gutter-md">
            <q-input
              v-model.number="settings.minDelayMinutes"
              outlined
              stack-label
              label="Min job delay"
              :rules="[vRequired]"
              type="number"
              class="col-4"
            ></q-input>
            <q-input
              v-model.number="settings.maxDelayMinutes"
              outlined
              stack-label
              label="Max job delay"
              :rules="[vRequired, value => vMoreThan(value, settings.minDelayMinutes)]"
              type="number"
              class="col-4"
            ></q-input>
          </div>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>
