<template>
  <v-tooltip location="top" :disabled="!hasErrors">
    <template #activator="{ props }">
      <NuxtLink :to="`${PLANNING_URL}/${volunteer.id}`">
        <v-chip
          v-bind="props"
          :class="volunteerStatus"
          :closable="!disabled"
          @click:close="removeVolunteer"
        >
          {{ buildUserNameWithNickname(volunteer) }}
        </v-chip>
      </NuxtLink>
    </template>
    <v-list-item v-for="(message, i) in errorMessages" :key="i">
      {{ message }}
    </v-list-item>
  </v-tooltip>
</template>

<script lang="ts" setup>
import type { VolunteerWithConflicts } from "@overbookd/festival-event";
import { buildUserNameWithNickname } from "@overbookd/user";
import { PLANNING_URL } from "@overbookd/web-page";

const { volunteer } = defineProps({
  volunteer: {
    type: Object as () => VolunteerWithConflicts,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["remove"]);
const removeVolunteer = () => emit("remove", volunteer);

const isNotAvailable = computed<boolean>(
  () => volunteer.conflicts.availability,
);
const isAlsoRequested = computed<boolean>(
  () => volunteer.conflicts.tasks.length > 0,
);
const isAlreadyAssigned = computed<boolean>(
  () => volunteer.conflicts.assignments.length > 0,
);

const volunteerStatus = computed<string>(() => {
  if (isAlreadyAssigned.value) return "conflict-already-assigned";
  if (isAlsoRequested.value) return "conflict-also-requested-by-ft-color";
  if (isNotAvailable.value) return "conflict-not-available-for-ft-color";
  return "";
});

const hasErrors = computed<boolean>(
  () =>
    isNotAvailable.value || isAlsoRequested.value || isAlreadyAssigned.value,
);

const alsoRequestedByErrors = computed<string[]>(() =>
  volunteer.conflicts.tasks.map(
    ({ id, name }) => `Aussi demandé dans la FT #${id} - ${name}`,
  ),
);
const alreadyAssignedErrors = computed<string[]>(() =>
  volunteer.conflicts.assignments.map(
    ({ id, name }) => `Déjà affecté sur la FT #${id} - ${name}`,
  ),
);
const notAvailableErrors = computed<string[]>(() =>
  isNotAvailable.value ? ["N'est pas disponible sur le créneau"] : [],
);
const errorMessages = computed<string[]>(() => {
  if (!hasErrors.value) return [];
  return [
    ...notAvailableErrors.value,
    ...alsoRequestedByErrors.value,
    ...alreadyAssignedErrors.value,
  ];
});
</script>
