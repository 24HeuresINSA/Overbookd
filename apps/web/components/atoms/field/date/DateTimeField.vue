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
import { OverDate } from "@overbookd/time";

const date = defineModel<OverDate>({ required: true });

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

watch(
  () => date.value,
  () => (dateStringified.value = date.value.dateTimeString),
  { immediate: true },
);

const emit = defineEmits(["update:model-value", "enter"]);
const updateDate = (date: string) => {
  const overdate = OverDate.fromLocal(date);
  overdate.roundMinutes(step);
  emit("update:model-value", overdate);
};
const enterKeyDown = () => emit("enter");
</script>
