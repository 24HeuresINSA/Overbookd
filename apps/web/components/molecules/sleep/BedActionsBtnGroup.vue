<template>
  <v-btn-group>
    <v-btn
      v-if="!hidePlanning && isOccupied(bed) && bed.sleeper.id"
      v-tooltip:top="'Planning'"
      icon="mdi-calendar-blank"
      size="small"
      variant="text"
      :to="`${PLANNING_URL}/${bed.sleeper.id}`"
    />
    <v-btn
      v-if="!hideUpdate"
      v-tooltip:top="'Modifier'"
      icon="mdi-pencil"
      size="small"
      variant="text"
      @click="editBed(bed.id)"
    />
    <v-btn
      v-if="!hideDelete && isEmpty(bed)"
      v-tooltip:top="'Supprimer'"
      icon="mdi-delete"
      color="error"
      variant="text"
      @click="deleteBed(bed.id)"
    />
    <v-btn
      v-if="!hideWakeup && isOccupied(bed)"
      v-tooltip="'Réveiller'"
      icon="mdi-sleep-off"
      color="primary"
      variant="text"
      @click="wakeup(bed.id)"
    />
  </v-btn-group>
</template>

<script setup lang="ts">
import {
  isEmpty,
  isOccupied,
  type Bed,
  type EmptyBed,
  type OccupiedBed,
} from "@overbookd/sleep";
import { PLANNING_URL } from "@overbookd/web-page";

const sleepStore = useSleepStore();

const { bed } = defineProps({
  bed: {
    type: Object as PropType<Bed>,
    required: true,
  },
  hideUpdate: Boolean,
  hideDelete: Boolean,
  hidePlanning: Boolean,
  hidePhone: Boolean,
  hideWakeup: Boolean,
});

const wakeup = (bedId: OccupiedBed["id"]) => {
  sleepStore.wakeupSleeper(bedId);
};

const deleteBed = (bedId: EmptyBed["id"]) => {
  sleepStore.deleteBed(bedId);
};

const editBed = (bedId: Bed["id"]) => {
  sleepStore.setSelectedBed(bedId);
};
</script>
