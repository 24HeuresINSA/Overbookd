<template>
  <div v-if="shouldShowError" class="error-container">
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
import { FT, FTCardType, FTStatus } from "~/utils/models/ft";
import {
  generalErrors,
  detailErrors,
  signaErrors,
  timeWindowsErrors,
  securityErrors,
  collaboratorErrors,
} from "~/utils/rules/faValidationRules";
import {
  ftDetailErrors,
  ftGeneralErrors,
  ftParentFAErrors,
  ftTimeWindowsErrors,
} from "~/utils/rules/ftValidationRules";

export default Vue.extend({
  name: "CardErrorList",
  props: {
    festivalEvent: {
      type: String,
      default: "FA",
    },
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    isFA(): boolean {
      return this.festivalEvent === "FA";
    },
    errors(): string[] {
      if (this.isFA) return this.faErrors;
      return this.ftErrors;
    },
    faErrors(): string[] {
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
    ftErrors(): string[] {
      switch (this.type) {
        case FTCardType.GENERAL:
          return ftGeneralErrors(this.mFT);
        case FTCardType.PARENT_FA:
          return ftParentFAErrors(this.mFT);
        case FTCardType.DETAIL:
          return ftDetailErrors(this.mFT);
        case FTCardType.TIME_WINDOW:
          return ftTimeWindowsErrors(this.mFT);
        case FTCardType.LOGISTICS:
          return [];
        default:
          return [];
      }
    },
    isDisplayErrorMode(): boolean {
      if (this.isFA) {
        return (
          this.mFA.status === Status.SUBMITTED ||
          this.mFA.status === Status.REFUSED
        );
      }
      return (
        this.mFT.status === FTStatus.SUBMITTED ||
        this.mFT.status === FTStatus.REFUSED
      );
    },
    hasError(): boolean {
      return this.errors.length > 0;
    },
    shouldShowError(): boolean {
      return this.isDisplayErrorMode && this.hasError;
    },
  },
});
</script>

<style lang="scss" scoped>
.error-container {
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
