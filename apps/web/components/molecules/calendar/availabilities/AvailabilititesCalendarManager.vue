<template>
  <div class="calendar-manager">
    <div class="arrow-buttons desktop-only">
      <v-btn
        icon="mdi-chevron-left"
        variant="plain"
        size="x-large"
        density="compact"
        rounded="pill"
        :disabled="disablePrevious"
        @click="propagatePrevious"
      />
      <v-btn
        icon="mdi-chevron-right"
        variant="plain"
        size="x-large"
        density="compact"
        rounded="pill"
        :disabled="disableNext"
        @click="propagateNext"
      />
    </div>
    <h3 class="period-indicator">{{ periodIndicator }}</h3>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  disablePrevious: {
    type: Boolean,
    default: false,
  },
  disableNext: {
    type: Boolean,
    default: false,
  },
});

const displayedDay = defineModel<Date>({ required: true });

const periodIndicator = computed<string>(() => {
  const month = displayedDay.value.toLocaleDateString("fr-FR", {
    month: "long",
  });
  const year = displayedDay.value.getFullYear();
  return `${capitalizeFirstLetter(month)} ${year}`;
});

const emit = defineEmits(["previous", "next"]);
const propagatePrevious = () => {
  if (!props.disablePrevious) emit("previous");
};
const propagateNext = () => {
  if (!props.disableNext) emit("next");
};
</script>

<style lang="scss" scoped>
.calendar-manager {
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: left;
  @media (max-width: $mobile-max-width) {
    justify-content: center;
  }
  .arrow-buttons {
    display: flex;
  }
  .period-indicator {
    font-size: 1.5rem;
    font-weight: normal;
  }
}
</style>
