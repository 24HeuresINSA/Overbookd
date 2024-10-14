<template>
  <DialogCard @close="close">
    <template #title> Modifier une mobilisation </template>

    <template #subtitle>
      La manif commencera le {{ displayedManifDate }}.
    </template>

    <template #content>
      <MobilizationPeriodFormFields
        v-model:start="start"
        v-model:end="end"
        v-model:duration-split-in-hour="durationSplitInHour"
      />
    </template>

    <template #actions>
      <v-btn
        prepend-icon="mdi-checkbox-marked-circle-outline"
        text="Modifier la mobilisation"
        :disabled="cantUpdateMobilization"
        color="primary"
        size="large"
        @click="updateMobilization"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { Period, formatDate } from "@overbookd/time";
import type {
  Mobilization,
  UpdateMobilization,
} from "@overbookd/festival-event";

const configurationStore = useConfigurationStore();

const props = defineProps({
  mobilization: {
    type: Object as PropType<Mobilization>,
    required: true,
  },
});

const start = ref<Date>(props.mobilization.start);
const end = ref<Date>(props.mobilization.end);
const durationSplitInHour = ref<number | null>(
  props.mobilization.durationSplitInHour,
);

const eventStartDate = computed<Date>(() => configurationStore.eventStartDate);
const displayedManifDate = computed<string>(
  () => `vendredi ${formatDate(eventStartDate.value)}`,
);

const emit = defineEmits(["update", "close"]);
const close = () => emit("close");

const cantUpdateMobilization = computed<boolean>(() => {
  const isPeriodValid = Period.isValid({ start: start.value, end: end.value });
  const isDurationValid =
    durationSplitInHour.value === null || durationSplitInHour.value > 0;
  return !isPeriodValid || !isDurationValid;
});
const updateMobilization = () => {
  if (cantUpdateMobilization.value) return;
  const mobilization: UpdateMobilization = {
    start: start.value,
    end: end.value,
    durationSplitInHour: durationSplitInHour.value,
  };
  emit("update", props.mobilization.id, mobilization);
  close();
};
</script>
