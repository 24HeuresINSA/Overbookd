<template>
  <v-text-field
    v-model="dateStringified"
    :label="label"
    type="datetime-local"
    :step="fieldStep"
    :hide-details="hideDetails"
    :error-messages="errorMessages"
    return-object
    :disabled="disabled"
    @change="updateDate"
    @keydown.enter="enterKeyDown"
  />
</template>

<script lang="ts" setup>
import { ONE_MINUTE_IN_MS, ONE_SECOND_IN_MS } from "@overbookd/period";
import { formatLocalDateTime, roundMinutes } from "~/utils/date/date.utils";

const ONE_MINUTE_IN_SECONDS = ONE_MINUTE_IN_MS / ONE_SECOND_IN_MS;

const date = defineModel<Date>({ required: true });

const { label, disabled, hideDetails, step, errorMessages } = defineProps({
  label: {
    type: String,
    default: "Date",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
  step: {
    type: Number,
    default: 15,
  },
  errorMessages: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const dateStringified = ref<string>("");

const fieldStep = computed(() => step * ONE_MINUTE_IN_SECONDS);

const stringifyDate = (date?: Date | string): string => {
  if (!date) return "";
  return formatLocalDateTime(new Date(date));
};

watch(
  () => date.value,
  () => {
    dateStringified.value = stringifyDate(date.value);
  },
  { immediate: true },
);

const emit = defineEmits(["update:model-value", "enter"]);
const updateDate = (date: string) => {
  const roundedMinutes = roundMinutes(new Date(date), step);
  emit("update:model-value", roundedMinutes);
};
const enterKeyDown = () => emit("enter");
</script>
