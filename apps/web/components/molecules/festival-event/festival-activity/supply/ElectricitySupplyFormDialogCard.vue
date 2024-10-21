<template>
  <DialogCard @close="close">
    <template #title> {{ typeFormLabel }} un besoin en électricité </template>
    <template #content>
      <v-img src="/img/log/plugs.png" class="supply-img" />
      <v-select
        v-model="connection"
        type="select"
        label="Type de branchement *"
        :items="connectionWithLabels"
        item-value="connection"
        item-title="label"
        :rules="[rules.required]"
        @keydown.enter="confirmSupply"
      />
      <v-text-field
        v-model="device"
        label="Appareil *"
        :rules="[rules.required]"
        @keydown.enter="confirmSupply"
      />
      <v-text-field
        :model-value="power"
        label="Puissance par appareil *"
        type="number"
        suffix="Watts"
        :rules="[rules.number, rules.min, rules.required]"
        @update:model-value="updatePower"
        @keydown.enter="confirmSupply"
      />
      <v-text-field
        :model-value="count"
        type="number"
        label="Nombre *"
        :rules="[rules.number, rules.min, rules.required]"
        @update:model-value="updateCount"
        @keydown.enter="confirmSupply"
      />
      <v-text-field
        v-model="comment"
        label="Commentaire"
        hide-details
        @keydown.enter="confirmSupply"
      />
    </template>

    <template #actions>
      <v-btn
        :text="`${typeFormLabel} le besoin en électricité`"
        prepend-icon="mdi-checkbox-marked-circle-outline"
        :disabled="!canConfirmSupply"
        size="large"
        rounded
        @click="confirmSupply"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import {
  type ElectricityConnection,
  type ElectricitySupply,
  PC16_Prise_classique,
} from "@overbookd/festival-event";
import {
  electricityConnectionLabels,
  type ElectricityConnectionWithLabel,
} from "~/utils/festival-event/festival-activity/festival-activity.model";
import { isNumber, min, required } from "~/utils/rules/input.rules";

const emit = defineEmits(["add", "update", "close"]);

const props = defineProps({
  supply: {
    type: Object as PropType<ElectricitySupply | null>,
    default: () => null,
  },
});

const connection = ref<ElectricityConnection>(PC16_Prise_classique);
const device = ref<string>("");
const power = ref<number>(100);
const count = ref<number>(1);
const comment = ref<string | null>(null);

const updatePower = (value: string) => {
  const numberValue = parseInt(value, 10);
  if (!isNaN(numberValue)) power.value = numberValue;
};
const updateCount = (value: string) => {
  const numberValue = parseInt(value, 10);
  if (!isNaN(numberValue)) count.value = numberValue;
};

const rules = { number: isNumber, min: min(1), required };

const connectionWithLabels = computed<ElectricityConnectionWithLabel[]>(() => {
  return [...electricityConnectionLabels.entries()].map(
    ([connection, label]) => ({
      connection,
      label,
    }),
  );
});

const isUpdate = computed<boolean>(() => props.supply !== null);
const typeFormLabel = computed<string>(() =>
  isUpdate.value ? "Modifier" : "Ajouter",
);

const clearSupply = () => {
  connection.value = PC16_Prise_classique;
  device.value = "";
  power.value = 100;
  count.value = 1;
  comment.value = null;
};
const setSupply = () => {
  if (!props.supply) return clearSupply();

  connection.value = props.supply.connection;
  device.value = props.supply.device;
  power.value = props.supply.power;
  count.value = props.supply.count;
  comment.value = props.supply.comment;
};
watch(() => props.supply, setSupply, { immediate: true });

const canConfirmSupply = computed<boolean>(() => {
  const hasDevice = device.value.trim() !== "";
  const hasPower = power.value > 0;
  const hasCount = count.value > 0;
  return hasDevice && hasPower && hasCount;
});

const close = () => emit("close");
const confirmSupply = () => {
  if (!canConfirmSupply.value) return;

  const commentValue = comment.value?.trim() || null;
  const supply = {
    connection: connection.value,
    device: device.value.trim(),
    power: power.value,
    count: count.value,
    comment: commentValue,
  };

  if (isUpdate.value) {
    emit("update", { ...supply, id: props.supply?.id });
  } else {
    emit("add", supply);
  }
  close();
  clearSupply();
};
</script>

<style scoped>
.supply-img {
  width: 100%;
  max-width: 350px;
  margin: auto;
  margin-bottom: 15px;
}
</style>
