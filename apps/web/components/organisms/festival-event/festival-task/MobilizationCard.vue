<template>
  <v-card>
    <v-card-title> Mobilisations </v-card-title>
    <v-card-text>
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
