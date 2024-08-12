<template>
  <DialogCard @close="close">
    <template #title> Ajouter un créneau </template>

    <template #subtitle>
      La manif commencera le {{ displayedEventDate }}.
    </template>

    <template #content>
      <PeriodFormFields
        v-model:start="start"
        v-model:end="end"
        @enter="addPeriod"
      />
    </template>

    <template #actions>
      <v-btn
        prepend-icon="mdi-checkbox-marked-circle-outline"
        text="Ajouter le créneau"
        size="large"
        :disabled="!isValid"
        @click="addPeriod"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { formatDate } from "@overbookd/date";
import { type IProvidePeriod, Period } from "@overbookd/period";

const configurationStore = useConfigurationStore();

const start = ref<Date>(configurationStore.eventStartDate);
const end = ref<Date>(configurationStore.eventStartDate);

const displayedEventDate = computed<string>(
  () => `vendredi ${formatDate(configurationStore.eventStartDate)}`,
);
const period = computed<IProvidePeriod>(() => ({
  start: start.value,
  end: end.value,
}));
const isValid = computed<boolean>(() => Period.isValid(period.value));

const emit = defineEmits(["add", "close"]);
const close = () => emit("close");
const addPeriod = () => {
  if (!isValid.value) return;
  emit("add", period.value);
  close();

  start.value = configurationStore.eventStartDate;
  end.value = configurationStore.eventStartDate;
};
</script>
