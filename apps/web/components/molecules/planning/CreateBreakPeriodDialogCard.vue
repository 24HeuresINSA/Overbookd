<template>
  <DialogCard @close="close">
    <template #title> Ajouter un temps de pause au bénévole </template>

    <template #subtitle>
      Les temps de pause permettent de ne pas affecter le bénévole à un créneau
      pendant sa pause.
    </template>

    <template #content>
      <form>
        <DateTimeField :model-value="start" disabled hide-details />
        <v-text-field
          :model-value="duration.inHours"
          type="number"
          label="Durée en heures"
          suffix="h"
          :rules="[isNumber, min(1)]"
          @update:model-value="castInDuration"
        />
      </form>
    </template>

    <template #actions>
      <v-btn
        text="Ajouter la pause"
        :disabled="!canCreateBreakPeriod"
        prepend-icon="mdi-checkbox-marked-circle-outline"
        color="primary"
        size="large"
        @click="createBreakPeriod"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { Duration } from "@overbookd/time";
import { isNumber, min } from "~/utils/rules/input.rules";

const props = defineProps({
  start: {
    type: Date,
    required: true,
  },
});

const duration = ref<Duration>(Duration.hours(2));
const castInDuration = (hours: string) => {
  duration.value = Duration.hours(+hours);
}

const emit = defineEmits(["close", "create"]);
const close = () => emit("close");

const canCreateBreakPeriod = computed<boolean>(
  () => duration.value.inHours >= 1,
);
const createBreakPeriod = () => {
  if (!canCreateBreakPeriod.value) return;
  const during = { start: props.start, duration: duration.value };
  emit("create", during);
  close();
};
</script>

<style scoped>
form {
  display: flex;
  gap: 10px;
}
</style>
