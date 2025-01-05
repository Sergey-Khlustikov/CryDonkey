<script setup>
import { onBeforeMount, ref } from 'vue';
import AdsPowerAddressController from 'src/domains/user/controllers/AdsPowerAddressController';
import vRequired from 'src/helpers/validations/vRequired';

const activeAddress = defineModel('activeAddress');
const addresses = ref([]);
const loading = ref(false);

onBeforeMount(() => {
  getList();
});

const getList = async () => {
  try {
    loading.value = true;
    addresses.value = await AdsPowerAddressController.getList();

    if (!addresses.value.length) {
      addAddress();
    }
  } finally {
    loading.value = false;
  }
};

const addAddress = () => {
  addresses.value.push({
    name: '',
    host: '',
    port: '',
    editable: true,
  });
};

const saveAddress = async (address) => {
  const params = {
    name: address.name,
    host: address.host,
    port: address.port,
  };

  if (!address._id) {
    await AdsPowerAddressController.create(params);
  } else {
    await AdsPowerAddressController.update(address._id, params);
  }

  await getList();
};

const deleteAddress = async (id) => {
  await AdsPowerAddressController.delete(id);

  addresses.value = addresses.value.filter(address => address._id !== id);
};
</script>

<template>
  <div>
    <div class="text-h6 q-mb-md">AdsPower host addresses</div>

    <div v-for="(address, index) in addresses" :key="address._id + '_' + index">
      <div v-if="!address.editable" class="flex align-center q-mb-sm">
        <div>
          <q-radio v-model="activeAddress" :val="address._id" size="sm">
            <div>{{ address.name }}</div>
            <div>{{ address.host }}:{{ address.port }}</div>
          </q-radio>
        </div>

        <q-separator vertical class="q-ml-md q-mr-sm"></q-separator>

        <div>
          <q-btn @click="address.editable = true" icon="edit" flat color="warning" round></q-btn>
          <q-btn @click="deleteAddress(address._id)" icon="delete" flat color="red" round></q-btn>
        </div>
      </div>

      <q-form v-if="address.editable" @submit="saveAddress(address)" no-error-focus greedy>
        <div class="flex items-center">
          <q-input
            v-model="address.name"
            stack-label
            label="Name"
            :rules="[vRequired]"
            class="q-mr-sm"
            dense
          ></q-input>

          <q-input
            v-model="address.host"
            stack-label
            label="Host"
            :rules="[vRequired]"
            class="q-mr-sm"
            dense
            style="width: 100px"
          ></q-input>

          <q-input
            v-model.number="address.port"
            stack-label
            label="Port"
            :rules="[vRequired]"
            class="q-mr-sm"
            dense
            style="width: 100px"
          ></q-input>

          <div>
            <q-btn size="sm" icon="done" color="green" type="submit"></q-btn>
          </div>
        </div>
      </q-form>
    </div>

    <q-btn
      v-if="!addresses.length || addresses.every(address => !!address._id)"
      @click="addAddress"
      class="q-mt-sm"
      label="Add new address"
      color="primary"
      size="sm"
    ></q-btn>
  </div>
</template>
