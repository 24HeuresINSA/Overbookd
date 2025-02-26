<template>
  <DialogCard @close="close">
    <template #title> {{ typeFormLabel }} un créneau </template>

    <template #subtitle>
      La manif commencera le {{ displayedEventDate }}.
    </template>

    <template #content>
      <PeriodFormFields
        v-model:start="start"
        v-model:end="end"
        @enter="confirmPeriod"
      />
    </template>

    <template #actions>
      <v-btn
        prepend-icon="mdi-checkbox-marked-circle-outline"
        :text="`${typeFormLabel} le créneau`"
        :disabled="!isValid"
        size="large"
        rounded
        @click="confirmPeriod"
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

const props = defineProps({
  existingPeriod: {
    type: Object as PropType<IProvidePeriod | null>,
    default: () => null,
  },
});

const start = ref<Date>(configurationStore.eventStartDate);
const end = ref<Date>(
  new Date(configurationStore.eventStartDate.getTime() + ONE_HOUR_IN_MS),
);

const clearPeriod = () => {
  start.value = configurationStore.eventStartDate;
  end.value = new Date(
    configurationStore.eventStartDate.getTime() + ONE_HOUR_IN_MS,
  );
};

const setPeriod = () => {
  if (!props.existingPeriod) return clearPeriod();

  start.value = props.existingPeriod.start;
  end.value = props.existingPeriod.end;
};

watch(() => props.existingPeriod, setPeriod, { immediate: true });

const period = computed<IProvidePeriod>(() => ({
  start: start.value,
  end: end.value,
}));

const displayedEventDate = computed<string>(
  () => `vendredi ${formatDate(configurationStore.eventStartDate)}`,
);
const isValid = computed<boolean>(() => Period.isValid(period.value));
const isUpdate = computed<boolean>(() => props.existingPeriod !== null);
const typeFormLabel = computed<string>(() =>
  isUpdate.value ? "Modifier" : "Ajouter",
);

const emit = defineEmits(["add", "update", "close"]);
const close = () => emit("close");
const confirmPeriod = () => {
  if (!isValid.value) return;
  emit(isUpdate.value ? "update" : "add", { ...period.value });
  clearPeriod();
  close();
};
</script>
