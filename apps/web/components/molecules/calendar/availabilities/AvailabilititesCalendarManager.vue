<template>
  <div class="calendar-manager">
    <v-btn
      text="Valider les disponibilités"
      color="success"
      :disabled="cantValidate"
      @click="propagateValidation"
    />
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
    <h3 class="period-indicator">{{ day.displayableMonthWithYear }}</h3>
  </div>
</template>

<script lang="ts" setup>
import type { DayPresenter } from "~/utils/calendar/day.presenter";

const props = defineProps({
  day: {
    type: Object as PropType<DayPresenter>,
    required: true,
  },
  disablePrevious: {
    type: Boolean,
    default: false,
  },
  disableNext: {
    type: Boolean,
    default: false,
  },
  cantValidate: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["previous", "next", "validate"]);
const propagatePrevious = () => {
  if (!props.disablePrevious) emit("previous");
};
const propagateNext = () => {
  if (!props.disableNext) emit("next");
};
const propagateValidation = () => {
  if (!props.cantValidate) emit("validate");
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "ArrowLeft") propagatePrevious();
  if (event.key === "ArrowRight") propagateNext();
};
onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
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
