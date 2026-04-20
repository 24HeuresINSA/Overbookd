<template>
  <ConfirmationDialogCard
    confirm-color="error"
    abort-color="primary"
    @close="close"
    @confirm="confirm"
  >
    <template #title>Supprimer le créneau de pause</template>
    <template #statement>
      <div class="delete-statement">
        <p>
          Tu vas supprimer la pause
          <strong>"{{ selectedBreak.name }}"</strong> de
        </p>
        <v-chip
          color="primary"
          variant="elevated"
          class="assignment-metadata__chip"
        >
          <v-icon left>mdi-clock</v-icon>
          <span>{{ pausePeriod }}</span>
        </v-chip>
      </div>
    </template>
    <template #confirm-btn-content>
      <v-icon left> mdi-delete-empty-outline </v-icon>Supprimer
    </template>
  </ConfirmationDialogCard>
</template>

<script lang="ts" setup>
import type { BreakPeriod } from "@overbookd/assignment";
import { Period } from "@overbookd/time";

const { selectedBreak } = defineProps({
  selectedBreak: {
    type: Object as PropType<BreakPeriod>,
    required: true,
  },
});

const pausePeriod = computed<string>(() =>
  Period.init(selectedBreak).toString(),
);

const emit = defineEmits(["close", "confirm"]);
const close = () => emit("close");
const confirm = () => emit("confirm");
</script>
<style lang="scss" scoped>
.assignment-metadata {
  display: flex;
  gap: 15px;
  &__chip {
    .v-icon {
      margin-right: 5px;
    }
  }
}
.delete-statement {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
</style>
