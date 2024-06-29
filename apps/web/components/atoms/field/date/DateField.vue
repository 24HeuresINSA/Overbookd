<template>
  <v-text-field
    v-model="dateStringified"
    :label="label"
    type="date"
    :disabled="disabled"
    :hide-details="hideDetails"
    return-object
    @update:model-value="updateDate"
  />
</template>

<script lang="ts" setup>
import { formatLocalDate } from "~/utils/date/date.utils";

const emit = defineEmits(["update:model-value"]);

const date = defineModel<Date>({ required: true });

const { label, disabled, hideDetails } = defineProps({
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
});

const dateStringified = ref<string>("");

const stringifyDate = (date?: Date | string): string => {
  if (!date) return "";
  return formatLocalDate(new Date(date));
};

watch(
  () => date.value,
  () => {
    dateStringified.value = stringifyDate(date.value);
  },
  { immediate: true },
);

const updateDate = (date: string) => {
  emit("update:model-value", new Date(date));
};
</script>
