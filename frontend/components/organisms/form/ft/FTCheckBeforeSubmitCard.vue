<template>
  <v-card>
    <h1>🤔 T'es sûr que t'as rien oublié ? 🤔</h1>
    <div v-show="hasAtLeatOneError" class="my-container my-3">
      <h3>❌ Erreurs ❌</h3>
      <p class="important text-center">
        Tu dois corriger toutes les erreurs pour soumettre ta FT à validation !
      </p>
      <div v-show="hasGeneralErrors">
        <h4>Général</h4>
        <ul>
          <li v-for="label in generalErrors" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="hasParentFAErrors">
        <h4>FA associée</h4>
        <ul>
          <li v-for="label in parentFAErrors" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="hasDetailErrors">
        <h4>Détail</h4>
        <ul>
          <li v-for="label in detailErrors" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="hasTimeWindowsErrors">
        <h4>Créneaux</h4>
        <ul>
          <li v-for="label in timeWindowsErrors" :key="label">{{ label }}</li>
        </ul>
      </div>
    </div>

    <v-divider></v-divider>
    <div v-show="hasAtLeastOneWarning" class="my-container my-3">
      <h3>⚠️ Avertissements ⚠️</h3>
    </div>

    <v-divider></v-divider>
    <v-card-actions>
      <v-btn color="blue darken-1" text @click="$emit('close-dialog')">
        Annuler
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="hasAtLeatOneError"
        color="blue darken-1"
        text
        @click="$emit('submit')"
      >
        Soumettre
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

import { FT } from "~/utils/models/ft";
import {
  detailErrors,
  generalErrors,
  hasAtLeastOneFTError,
  hasAtLeastOneFTWarning,
  parentFAErrors,
  timeWindowsErrors,
} from "~/utils/rules/ftValidationRules";

export default Vue.extend({
  name: "FTCheckBeforeSubmitCard",
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    hasAtLeatOneError(): boolean {
      return hasAtLeastOneFTError(this.mFT);
    },
    hasAtLeastOneWarning(): boolean {
      return hasAtLeastOneFTWarning(this.mFT);
    },

    generalErrors(): string[] {
      return generalErrors(this.mFT);
    },
    hasGeneralErrors(): boolean {
      return this.generalErrors.length > 0;
    },

    parentFAErrors(): string[] {
      return parentFAErrors(this.mFT);
    },
    hasParentFAErrors(): boolean {
      return this.parentFAErrors.length > 0;
    },

    detailErrors(): string[] {
      return detailErrors(this.mFT);
    },
    hasDetailErrors(): boolean {
      return this.detailErrors.length > 0;
    },

    timeWindowsErrors(): string[] {
      return timeWindowsErrors(this.mFT);
    },
    hasTimeWindowsErrors(): boolean {
      return this.timeWindowsErrors.length > 0;
    },
  },
});
</script>

<style scoped lang="scss">
h1 {
  text-align: center;
  font-size: 1.8rem;
  padding: 10px 0;
}

.my-container {
  margin: 0 1.2rem;

  h3 {
    font-size: 1.3rem;
    font-weight: bold;
    margin: 0.5rem 0 0 0;
    text-align: center;
  }

  h4 {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0.5rem 0 0 0;
  }

  .text-center {
    text-align: center;
  }
}
</style>
