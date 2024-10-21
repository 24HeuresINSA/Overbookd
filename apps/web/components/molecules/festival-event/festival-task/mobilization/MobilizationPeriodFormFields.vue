<template>
  <div>
    <PeriodFormFields v-model:start="start" v-model:end="end" />

    <h3>Découpage du créneau</h3>
    <v-slider
      :model-value="durationSplitInHour || 0"
      min="0"
      max="4"
      step="1"
      thumb-label="always"
      show-ticks="always"
      :color="durationSplitInHour ? 'primary' : 'grey'"
      class="mt-7"
      hide-details
      @update:model-value="updateSplit"
    >
      <template #thumb-label="{ modelValue }">
        {{ modelValue ? `${modelValue}h` : "Aucun" }}
      </template>
    </v-slider>
  </div>
</template>

<script lang="ts" setup>
const start = defineModel<Date>("start", { required: true });
const end = defineModel<Date>("end", { required: true });
const durationSplitInHour = defineModel<number | null>("durationSplitInHour", {
  required: true,
});

const emit = defineEmits(["update:duration-split-in-hour"]);
const updateSplit = (duration: number | null) => {
  emit("update:duration-split-in-hour", duration || null);
};
</script>
