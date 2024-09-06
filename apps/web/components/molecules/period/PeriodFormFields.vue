<template>
  <h3>Début du créneau</h3>
  <DateTimeField v-model="start" no-label @enter="enterKeyDown" />

  <h3>Fin du créneau</h3>
  <DateTimeField
    v-model="end"
    :error-messages="errors"
    no-label
    @enter="enterKeyDown"
  />
</template>

<script lang="ts" setup>
import { Period } from "@overbookd/time";

const start = defineModel<Date>("start", { required: true });
const end = defineModel<Date>("end", { required: true });

const errors = computed<string[]>(() =>
  Period.errors({ start: start.value, end: end.value }),
);

const emit = defineEmits(["enter"]);
const enterKeyDown = () => emit("enter");
</script>
