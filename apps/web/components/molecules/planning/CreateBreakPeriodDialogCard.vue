<template>
  <DialogCard @close="close" @enter="createBreakPeriod">
    <template #title> Ajouter un temps de pause au bénévole </template>

    <template #subtitle>
      Les temps de pause permettent de ne pas affecter le bénévole à un créneau
      pendant sa pause.
    </template>

    <template #content>
      <form>
        <div class="break-data">
          <v-text-field
            v-model="name"
            label="Nom de la pause"
            @keydown.enter.prevent="createBreakPeriod"
          />
          <DateTimeField :model-value="start" readonly />
        </div>
        <div class="duration-form">
          <strong>Durée de la pause :</strong>
          <div class="duration-inputs">
            <v-text-field
              v-model="durationHours"
              type="number"
              label="Heures"
              suffix="h"
              :rules="[isNumber, min(0)]"
              @keydown.enter.prevent="createBreakPeriod"
            />
            <v-text-field
              v-model="durationMinutes"
              type="number"
              label="Minutes"
              suffix="min"
              :rules="[isNumber, isSpecificNumbers([0, 30])]"
              @keydown.enter.prevent="createBreakPeriod"
            />
          </div>
        </div>
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
import { isNumber, min, isSpecificNumbers } from "~/utils/rules/input.rules";

const props = defineProps({
  start: {
    type: Date,
    required: true,
  },
});

const name = ref<string>("Pause");
const duration = ref<Duration>(Duration.hours(2));
const durationHours = computed({
  get() {
    return Math.floor(duration.value.inMinutes / 60);
  },
  set(hours: string) {
    castInDuration(+hours, durationMinutes.value);
  },
});
const durationMinutes = computed({
  get() {
    return duration.value.inMinutes % 60;
  },
  set(minutes: string) {
    castInDuration(durationHours.value, +minutes);
  },
});

const castInDuration = (hours: number, minutes: number) => {
  const totalMinutes = hours * 60 + minutes;
  duration.value = Duration.minutes(totalMinutes);
};

const emit = defineEmits(["close", "create"]);
const close = () => emit("close");

const canCreateBreakPeriod = computed<boolean>(
  () =>
    name.value.trim() !== "" &&
    durationHours.value >= 0 &&
    durationMinutes.value % 30 === 0 &&
    duration.value.inMinutes >= 30,
);
const createBreakPeriod = () => {
  if (!canCreateBreakPeriod.value) return;
  const breakPeriod = {
    name: name.value.trim(),
    during: {
      start: props.start,
      duration: duration.value,
    },
  };
  emit("create", breakPeriod);
  close();
};
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
}

.duration-form {
  display: flex;
  flex-direction: column;
}

.break-data,
.duration-inputs {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
}
</style>
