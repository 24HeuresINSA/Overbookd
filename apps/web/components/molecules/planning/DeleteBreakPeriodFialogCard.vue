<template>
  <ConfirmationDialogCard
    confirm-color="error"
    abort-color="primary"
    @close="close()"
    @confirm="confirm()"
  >
    <template #title>Supprimer le créneau de pause</template>
    <template #statement>
      <div class="delete-statement">
        <p>Tu vas supprimer la pause de</p>
        <v-chip
          color="primary"
          variant="elevated"
          class="assignment-metadata__chip"
        >
          <v-icon left>mdi-clock</v-icon>
          <span>{{ pauseLabel }}</span>
        </v-chip>
      </div>
    </template>
    <template #confirm-btn-content>
      <v-icon left> mdi-delete-empty-outline </v-icon>Supprimer
    </template>
  </ConfirmationDialogCard>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import type { Period } from "@overbookd/time";

const props = defineProps<{
  selectedBreak?: Period;
}>();

const emit = defineEmits(["close", "confirm"]);
const close = () => emit("close");
const confirm = () => emit("confirm");

const pauseLabel = computed(
  () => props.selectedBreak?.toString() ?? "Période inconnue",
);
</script>
