<template>
  <v-card class="ma-2" :class="{ blink: blinking }">
    <v-card-title>
      <div style="display: flex; flex-direction: row; align-items: center">
        <v-icon
          v-if="sleeper.sleeper.comment"
          v-tooltip:top="sleeper.sleeper.comment"
          icon="mdi-comment"
          size="x-small"
          class="me-1"
        />
        {{ sleeper.sleeper.name }}
        {{ sleeper.bed.room.label }}
        {{ sleeper.bed.label }}
        {{ formatDateWithHoursAndMinutesOnly(sleeper.sleeper.wakeupTime) }}
        <v-spacer />
        <BedActionsBtnGroup :bed="sleeper" hide-wakeup />
      </div>
    </v-card-title>
    <v-card-text>
      <v-btn
        append-icon="mdi-sleep-off"
        size="small"
        color="primary"
        block
        @click="wakeup(sleeper.id)"
      >
        Orga debout
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { OccupiedBed } from "@overbookd/sleep";
import {
  ONE_MINUTE_IN_MS,
  formatDateWithHoursAndMinutesOnly,
  getMinuteDiff,
} from "@overbookd/time";

const sleepStore = useSleepStore();

const { sleeper } = defineProps({
  sleeper: {
    required: true,
    type: Object as PropType<OccupiedBed>,
  },
});

const shouldBlink = (): boolean =>
  getMinuteDiff(new Date(), new Date(sleeper.sleeper.wakeupTime)) < 6;
const blinking = ref<boolean>(shouldBlink());

const checkBlinkingInterval = !blinking.value
  ? setInterval(() => (blinking.value = shouldBlink()), ONE_MINUTE_IN_MS / 2)
  : null;

const wakeup = (bedId: OccupiedBed["id"]) => {
  sleepStore.wakeupSleeper(bedId);
};

onDeactivated(() => {
  if (checkBlinkingInterval) {
    clearInterval(checkBlinkingInterval);
  }
});
</script>

<style lang="css" scoped>
.blink {
  animation: blinking ease-out 1s infinite;
}

@keyframes blinking {
  0%,
  100% {
    background-color: red;
  }
  50% {
    background-color: #fff;
  }
}
</style>
