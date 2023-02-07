<template>
  <div class="volunteer-request">
    <v-chip
      :close="!disabled"
      :class="userRequestStatus"
      @click:close="deleteUserRequest()"
    >
      {{ userName }}
    </v-chip>
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
      return this.userRequest.alsoRequestedBy.length > 0
        ? "also-requested-by-ft"
        : "";
    },
    userName(): string {
      return formatUsername(this.userRequest.user);
    },
  },
  methods: {
    deleteUserRequest(): void {
      this.$emit("delete-user-request", this.userRequest);
    },
  },
});
</script>
