<template>
  <h3>Début du créneau</h3>
  <DateTimeField v-model="start" label="Début" @enter="enterKeyDown" />

  <h3>Fin du créneau</h3>
  <DateTimeField
    v-model="end"
    label="Fin"
    :error-messages="errors"
    @enter="enterKeyDown"
  />
</template>

<script lang="ts" setup>
import { Period } from "@overbookd/time";

const start = defineModel<Date>("start", { required: true });
const end = defineModel<Date>("end", { required: true });

const errors = computed<string[]>(() => {
  return Period.errors({ start: start.value, end: end.value });
});

const emit = defineEmits(["enter"]);
const enterKeyDown = () => emit("enter");
</script>
