<template>
  <v-text-field
    :model-value="dateStringified"
    :label="noLabel ? undefined : label"
    type="datetime-local"
    :hide-details="hideDetails"
    :error-messages="errorMessages"
    :disabled="disabled"
    @update:model-value="updateDate"
    @keydown.enter="enterKeyDown"
  />
</template>

<script lang="ts" setup>
import { OverDate, formatLocalDateTime, roundMinutes } from "@overbookd/time";

const date = defineModel<Date>({ required: true });

const { step } = defineProps({
  label: {
    type: String,
    default: "Date",
  },
  noLabel: {
    type: Boolean,
    default: false,
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
const stringifyDate = (date?: Date | string): string => {
  if (!date) return "";
  return formatLocalDateTime(date);
};

watch(
  () => date.value,
  () => (dateStringified.value = stringifyDate(date.value)),
  { immediate: true },
);

const emit = defineEmits(["update:model-value", "enter"]);

const updateDate = useDebounceFn((date: string) => {
  const fixedDate = OverDate.fromLocal(new Date(date)).date;
  const roundedMinutes = roundMinutes(fixedDate, step);
  emit("update:model-value", roundedMinutes);
}, 500);
const enterKeyDown = () => emit("enter");
</script>
