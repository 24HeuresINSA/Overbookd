<template>
  <div class="volunteer-request">
    <v-tooltip top color="error" :disabled="!hasErrors">
      <template #activator="{ on, attrs }">
        <v-chip
          :close="!disabled"
          :class="userRequestStatus"
          v-bind="attrs"
          @click:close="deleteUserRequest()"
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
import { FTUserRequestImpl } from "~/utils/models/ft";
import { formatUsername } from "~/utils/user/userUtils";
export default Vue.extend({
  name: "VolunteerRequestChip",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    userRequest: {
      type: FTUserRequestImpl,
      required: true,
    },
  },
  computed: {
    userRequestStatus(): string {
      return this.hasErrors ? "also-requested-by-ft" : "";
    },
    userName(): string {
      return formatUsername(this.userRequest.user);
    },
    hasErrors(): boolean {
      return (
        this.userRequest.alsoRequestedBy.length > 0 ||
        !this.userRequest.isAvailable
      );
    },
    errorMessages(): string[] {
      if (!this.hasErrors) return [];
      return [...this.alsoRequestedByErrors, this.notAvailableError];
    },
    alsoRequestedByErrors(): string[] {
      return this.userRequest.alsoRequestedBy.map(
        (ft) => `Aussi demande dans la FT #${ft.id} - ${ft.name}`
      );
    },
    notAvailableError(): string {
      return "N'est pas disponible sur le creneau";
    },
  },
  methods: {
    deleteUserRequest(): void {
      this.$emit("delete-user-request", this.userRequest);
    },
  },
});
</script>
