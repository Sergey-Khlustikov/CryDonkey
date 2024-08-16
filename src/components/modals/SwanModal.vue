<script setup>
import { useDialogPluginComponent } from 'quasar'
import { computed, ref } from 'vue'
import Api from 'src/api/Api'

const props = defineProps({
  profileIds: {
    type: Array,
    required: true
  }
})

defineEmits([
  ...useDialogPluginComponent.emits
])

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel
} = useDialogPluginComponent()

const dailyFirst = ref(null)
const dailySecond = ref(null)
const dailyThird = ref(null)
const onlyDaily = ref(true)

const allDailyFieldsFilled = computed(() => {
  return dailyFirst.value && dailySecond.value && dailyThird.value
})

async function onSubmit () {
  Api.runSwan({
    profileIds: props.profileIds,
    dailyFirst: dailyFirst.value,
    dailySecond: dailySecond.value,
    dailyThird: dailyThird.value,
    onlyDaily: onlyDaily.value,
  })

  onDialogOK()
}
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 600px; max-width: 80vw;">
      <q-form @submit="onSubmit">
        <div class="text-h6 q-ml-md q-mt-md">Daily Combo</div>

        <q-card-section>
          <div class="row no-wrap q-gutter-md">
            <q-input
              filled
              v-model="dailyFirst"
              label="First number"
              lazy-rules
              :rules="[ val => val && val.length > 0]"
              type="number"
            />
            <q-input
              filled
              v-model="dailySecond"
              label="Second number"
              lazy-rules
              :rules="[ val => val && val.length > 0]"
              type="number"
            />
            <q-input
              filled
              v-model="dailyThird"
              label="Third number"
              lazy-rules
              :rules="[ val => val && val.length > 0]"
              type="number"
            />
          </div>

          <q-checkbox v-model="onlyDaily" label="Only daily task"/>
        </q-card-section>

        <q-card-actions align="right" class="q-mr-sm q-mb-sm">
          <q-btn color="primary" label="Cancel" @click="onDialogCancel"></q-btn>
          <q-btn color="primary" label="OK" style="width: 60px;" type="submit" :disable="!allDailyFieldsFilled"></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
