<template>
  <div class="volunteer-request">
    <v-tooltip top color="error" :disabled="!hasErrors">
      <template #activator="{ on, attrs }">
        <NuxtLink :to="`/planning/${volunteer.id}`">
          <v-chip
            :class="volunteerStatus"
            v-bind="attrs"
            :close="!disabled"
            v-on="on"
            @click:close="removeVolunteer"
          >
            {{ formatUserNameWithNickname(volunteer) }}
          </v-chip>
        </NuxtLink>
      </template>
      <v-list-item v-for="(message, i) in errorMessages" :key="i" dark>
        <v-list-item-content>
          <v-list-item-title> {{ message }} </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { VolunteerWithConflicts } from "@overbookd/festival-event";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

export default defineComponent({
  name: "VolunteerWithConflictsChip",
  props: {
    volunteer: {
      type: Object as () => VolunteerWithConflicts,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["remove"],
  computed: {
    isNotAvailable(): boolean {
      return this.volunteer.conflicts.availability;
    },
    isAlsoRequested(): boolean {
      return this.volunteer.conflicts.tasks.length > 0;
    },
    isAlreadyAssigned(): boolean {
      return this.volunteer.conflicts.assignments.length > 0;
    },
    volunteerStatus(): string {
      if (this.isAlreadyAssigned) return "already-assigned";
      if (this.isAlsoRequested) return "also-requested-by-ft";
      if (this.isNotAvailable) return "not-available";
      return "";
    },
    hasErrors(): boolean {
      return (
        this.isNotAvailable || this.isAlsoRequested || this.isAlreadyAssigned
      );
    },
    errorMessages(): string[] {
      if (!this.hasErrors) return [];
      return [
        ...this.notAvailableErrors,
        ...this.alsoRequestedByErrors,
        ...this.alreadyAssignedErrors,
      ];
    },
    alsoRequestedByErrors(): string[] {
      return this.volunteer.conflicts.tasks.map(
        ({ id, name }) => `Aussi demandé dans la FT #${id} - ${name}`,
      );
    },
    alreadyAssignedErrors(): string[] {
      return this.volunteer.conflicts.assignments.map(
        ({ id, name }) => `Déjà affecté sur la FT #${id} - ${name}`,
      );
    },
    notAvailableErrors(): string[] {
      return this.isNotAvailable ? ["N'est pas disponible sur le créneau"] : [];
    },
  },
  methods: {
    formatUserNameWithNickname,
    removeVolunteer() {
      this.$emit("remove", this.volunteer);
    },
  },
});
</script>
