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
import { FA, fa_card_type } from "~/utils/models/FA";
import {
  hasGeneralErrors,
  hasDetailErrors,
  hasSignaErrors,
  hasTimeWindowsErrors,
  hasSecurityErrors,
  hasCollaboratorErrors,
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
          return hasGeneralErrors(this.mFA);
        case fa_card_type.DETAIL:
          return hasDetailErrors(this.mFA);
        case fa_card_type.SIGNA:
          return hasSignaErrors(this.mFA);
        case fa_card_type.TIME_WINDOW:
          return hasTimeWindowsErrors(this.mFA);
        case fa_card_type.SECURITY:
          return hasSecurityErrors(this.mFA);
        case fa_card_type.COLLABORATOR:
          return hasCollaboratorErrors(this.mFA);
        default:
          return [];
      }
    },
    shouldShowError(): boolean {
      return (
        (this.mFA.status === "SUBMITTED" || this.mFA.status === "REFUSED") &&
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
