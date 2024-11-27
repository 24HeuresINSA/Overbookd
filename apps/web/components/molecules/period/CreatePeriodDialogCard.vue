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
        :disabled="!isValid"
        size="large"
        rounded
        @click="addPeriod"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import {
  type IProvidePeriod,
  ONE_HOUR_IN_MS,
  Period,
  formatDate,
} from "@overbookd/time";

const configurationStore = useConfigurationStore();

const start = ref<Date>(configurationStore.eventStartDate);
const end = ref<Date>(
  new Date(configurationStore.eventStartDate.getTime() + ONE_HOUR_IN_MS),
);
const period = computed<IProvidePeriod>(() => ({
  start: start.value,
  end: end.value,
}));

const displayedEventDate = computed<string>(
  () => `vendredi ${formatDate(configurationStore.eventStartDate)}`,
);
const isValid = computed<boolean>(() => Period.isValid(period.value));

const emit = defineEmits(["add", "close"]);
const close = () => emit("close");
const addPeriod = () => {
  if (!isValid.value) return;
  emit("add", period.value);
  close();

  start.value = configurationStore.eventStartDate;
  end.value = new Date(
    configurationStore.eventStartDate.getTime() + ONE_HOUR_IN_MS,
  );
};
</script>
