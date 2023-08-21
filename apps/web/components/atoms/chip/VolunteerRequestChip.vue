<template>
  <div class="volunteer-request">
    <v-tooltip top color="error" :disabled="!hasErrors">
      <template #activator="{ on, attrs }">
        <v-chip
          :close="!disabled"
          :class="userRequestStatus"
          v-bind="attrs"
          @click:close="deleteUserRequest()"
          @click="redirectToCalendar()"
          v-on="on"
        >
          {{ userName }}
        </v-chip>
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
import Vue from "vue";
import { FtUserRequestImpl } from "~/utils/models/ft";
import { formatUsername } from "~/utils/user/userUtils";
export default Vue.extend({
  name: "VolunteerRequestChip",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    userRequest: {
      type: FtUserRequestImpl,
      required: true,
    },
  },
  computed: {
    userRequestStatus(): string {
      if (this.isNotAvailable) return "not-available";
      if (this.isAlsoRequested) return "also-requested-by-ft";
      if (this.isAlreadyAssigned) return "already-assigned";
      return "";
    },
    userName(): string {
      return formatUsername(this.userRequest.user);
    },
    isNotAvailable(): boolean {
      return !this.userRequest.isAvailable;
    },
    isAlreadyAssigned(): boolean {
      return this.userRequest.isAlreadyAssigned;
    },
    isAlsoRequested(): boolean {
      return this.userRequest.alsoRequestedBy.length > 0;
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
      return this.userRequest.alsoRequestedBy.map(
        (ft) => `Aussi demande dans la FT #${ft.id} - ${ft.name}`
      );
    },
    notAvailableErrors(): string[] {
      return this.isNotAvailable ? ["N'est pas disponible sur le creneau"] : [];
    },
    alreadyAssignedErrors(): string[] {
      return this.isAlreadyAssigned
        ? ["Déjà assigné à un autre creneau. Cliquez pour voir son planning."]
        : [];
    },
  },
  methods: {
    deleteUserRequest(): void {
      this.$emit("delete-user-request", this.userRequest);
    },
    redirectToCalendar() {
      window.open(`/planning/${this.userRequest.user.id}`);
    },
  },
});
</script>
