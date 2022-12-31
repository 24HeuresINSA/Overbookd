<template>
  <div v-if="shouldShowError" class="my-container">
    <v-icon color="red" large>mdi-alert</v-icon>
    <ul>
      <li v-for="error in errors" :key="error" class="important" dense>
        {{ error }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { FA, fa_card_type, Status } from "~/utils/models/FA";
import {
  generalErrors,
  detailErrors,
  signaErrors,
  timeWindowsErrors,
  securityErrors,
  collaboratorErrors,
} from "~/utils/rules/faValidationRules";

export default Vue.extend({
  name: "CardErrorList",
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    errors(): string[] {
      switch (this.type) {
        case fa_card_type.GENERAL:
          return generalErrors(this.mFA);
        case fa_card_type.DETAIL:
          return detailErrors(this.mFA);
        case fa_card_type.SIGNA:
          return signaErrors(this.mFA);
        case fa_card_type.TIME_WINDOW:
          return timeWindowsErrors(this.mFA);
        case fa_card_type.SECURITY:
          return securityErrors(this.mFA);
        case fa_card_type.COLLABORATOR:
          return collaboratorErrors(this.mFA);
        default:
          return [];
      }
    },
    shouldShowError(): boolean {
      return (
        (this.mFA.status === Status.SUBMITTED ||
          this.mFA.status === Status.REFUSED) &&
        this.errors.length > 0
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.my-container {
  display: flex;
  align-items: center;

  .v-icon {
    margin-left: 1rem;
  }

  ul {
    list-style: none;
    padding-left: 1rem;
  }
}
</style>
