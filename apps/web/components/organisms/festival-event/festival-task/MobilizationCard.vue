<template>
  <v-card>
    <div class="title">
      <v-card-title class="title">
        <span>Mobilisations</span>
        <v-btn
          icon="mdi-calendar-blank"
          color="secondary"
          rounded="pill"
          density="comfortable"
          @click="openCalendar"
        />
      </v-card-title>
    </div>
    <v-card-text class="mobilizations">
      <MobilizationTable
        :disabled="disabled"
        @add="addMobilization"
        @update="updateMobilization"
        @remove="removeMobilization"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type {
  Mobilization,
  UpdateMobilization,
} from "@overbookd/festival-event";
import type { AddMobilizationForm } from "@overbookd/http";

const ftStore = useFestivalTaskStore();

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["open:calendar"]);
const openCalendar = () => emit("open:calendar");

const addMobilization = (mobilization: AddMobilizationForm) => {
  ftStore.addMobilization(mobilization);
};
const updateMobilization = (
  mobilizationId: Mobilization["id"],
  mobilization: UpdateMobilization,
) => {
  ftStore.updateMobilization(mobilizationId, mobilization);
};
const removeMobilization = (mobilization: Mobilization) => {
  ftStore.removeMobilization(mobilization.id);
};
</script>

<style scoped>
.title {
  display: flex;
  gap: 10px;
  align-items: center;
}

.mobilizations {
  padding-top: 0;
}
</style>
