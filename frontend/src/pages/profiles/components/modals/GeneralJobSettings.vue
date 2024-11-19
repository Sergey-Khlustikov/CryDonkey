<script setup>
import { onMounted, reactive, watch } from 'vue';
import DontCloseProfiles from 'src/pages/profiles/components/DontCloseProfiles.vue';
import vRequired from 'src/helpers/validations/vRequired';
import vMoreThan from 'src/helpers/validations/vMoreThan';
import CollapsableModalSection from 'src/components/modals/CollapsableModalSection.vue';

const props = defineProps({
  profiles: {
    type: Array,
    required: true,
  },
});

const emits = defineEmits(['update:modelValue']);

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
  <collapsable-modal-section header-text="General Settings">
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
  </collapsable-modal-section>
</template>
