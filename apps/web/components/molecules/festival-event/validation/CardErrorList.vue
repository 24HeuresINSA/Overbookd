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
import { Fa, FaCardType, FaStatus } from "~/utils/models/fa.model";
import { Ft, FtCardType, FtStatus } from "~/utils/models/ft.model";
import {
  collaboratorErrors,
  detailErrors,
  generalErrors,
  securityErrors,
  signaErrors,
  timeWindowsErrors,
} from "~/utils/rules/fa-validation.rules";
import {
  ftDetailErrors,
  ftGeneralErrors,
  ftParentFAErrors,
  ftTimeWindowsErrors,
} from "~/utils/rules/ft-validation.rules";

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
    mFA(): Fa {
      return this.$accessor.fa.mFA;
    },
    mFT(): Ft {
      return this.$accessor.ft.mFT;
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
        case FaCardType.GENERAL:
          return generalErrors(this.mFA);
        case FaCardType.DETAIL:
          return detailErrors(this.mFA);
        case FaCardType.SIGNA:
          return signaErrors(this.mFA);
        case FaCardType.TIME_WINDOW:
          return timeWindowsErrors(this.mFA);
        case FaCardType.SECURITY:
          return securityErrors(this.mFA);
        case FaCardType.COLLABORATOR:
          return collaboratorErrors(this.mFA);
        default:
          return [];
      }
    },
    ftErrors(): string[] {
      switch (this.type) {
        case FtCardType.GENERAL:
          return ftGeneralErrors(this.mFT);
        case FtCardType.PARENT_FA:
          return ftParentFAErrors(this.mFT);
        case FtCardType.DETAIL:
          return ftDetailErrors(this.mFT);
        case FtCardType.TIME_WINDOW:
          return ftTimeWindowsErrors(this.mFT);
        case FtCardType.LOGISTICS:
          return [];
        default:
          return [];
      }
    },
    isDisplayErrorMode(): boolean {
      if (this.isFA) {
        return (
          this.mFA.status === FaStatus.SUBMITTED ||
          this.mFA.status === FaStatus.REFUSED
        );
      }
      return (
        this.mFT.status === FtStatus.SUBMITTED ||
        this.mFT.status === FtStatus.REFUSED
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
