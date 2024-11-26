<template>
  <v-text-field
    :model-value="dateStringified"
    :label="label"
    type="date"
    :disabled="disabled"
    :hide-details="hideDetails"
    @update:model-value="updateDate"
  />
</template>

<script lang="ts" setup>
import { OverDate, isDateString } from "@overbookd/time";

const date = defineModel<OverDate>({ required: true });

defineProps({
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

watch(
  () => date.value,
  () => (dateStringified.value = date.value.dateString),
  { immediate: true },
);

const emit = defineEmits(["update:model-value"]);
const updateDate = (date: string) => {
  if (!isDateString(date)) return;
  emit("update:model-value", OverDate.init({ date, hour: 0 }));
};
</script>
