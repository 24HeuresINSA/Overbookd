<template>
  <v-card>
    <h1>🤔 T'es sûr que t'as rien oublié ? 🤔</h1>
    <div v-show="hasAtLeatOneError" class="my-container my-3">
      <h3>❌ Erreurs ❌</h3>
      <p class="important text-center">
        Tu dois corriger toutes les erreurs pour soumettre ta FA à validation !
      </p>
      <div v-show="hasGeneralErrors">
        <h4>Général</h4>
        <ul>
          <li v-for="label in generalErrors" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="hasDetailErrors">
        <h4>Détail</h4>
        <ul>
          <li v-for="label in detailErrors" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="hasSignaErrors">
        <h4>Signa</h4>
        <ul>
          <li v-for="label in signaErrors" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="hasTimeWindowsErrors">
        <h4>Créneaux</h4>
        <ul>
          <li v-for="label in timeWindowsErrors" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="hasSecurityErrors">
        <h4>Securité</h4>
        <ul>
          <li v-for="label in securityErrors" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="hasCollaboratorErrors">
        <h4>Presta</h4>
        <ul>
          <li v-for="label in collaboratorErrors" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="hasGearRequestErrors">
        <h4>Logistique</h4>
        <ul>
          <li v-for="label in gearRequestErrors" :key="label">{{ label }}</li>
        </ul>
      </div>
    </div>

    <v-divider></v-divider>
    <div v-show="hasAtLeastOneWarning" class="my-container my-3">
      <h3>⚠️ Avertissements ⚠️</h3>
      <div v-show="detailWarnings.length > 0">
        <h4>Détail</h4>
        <ul>
          <li v-for="label in detailWarnings" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="hasSignaWarnings">
        <h4>Signa</h4>
        <ul>
          <li v-for="label in signaWarnings" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="hasSecurityWarnings">
        <h4>Securité</h4>
        <ul>
          <li v-for="label in securityWarnings" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="hasCollaboratorWarnings">
        <h4>Presta</h4>
        <ul>
          <li v-for="label in collaboratorWarnings" :key="label">
            {{ label }}
          </li>
        </ul>
      </div>

      <div v-show="hasGearRequestWarnings">
        <h4>Logistique</h4>
        <ul>
          <li v-for="label in gearRequestWarnings" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="hasElecWarnings">
        <h4>Besoin d'électricité</h4>
        <ul>
          <li v-for="label in elecWarnings" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="hasWaterWarnings">
        <h4>Besoin d'eau</h4>
        <ul>
          <li v-for="label in waterWarnings" :key="label">{{ label }}</li>
        </ul>
      </div>
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
import {
  hasAtLeastOneError,
  hasAtLeastOneWarning,
  generalErrors,
  detailErrors,
  detailWarnings,
  signaErrors,
  signaWarnings,
  timeWindowsErrors,
  securityErrors,
  securityWarnings,
  collaboratorErrors,
  collaboratorWarnings,
  gearRequestErrors,
  gearRequestWarnings,
  elecWarnings,
  waterWarnings,
} from "~/utils/rules/faValidationRules";
import { FA } from "~/utils/models/FA";
import { SortedStoredGearRequests } from "~/utils/models/gearRequests";

export default Vue.extend({
  name: "CheckBeforeSubmitCard",
  computed: {
    FA(): any {
      return this.$accessor.FA;
    },
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    allSortedGearRequests(): SortedStoredGearRequests {
      return this.$accessor.FA.allSortedGearRequests;
    },

    hasAtLeatOneError(): boolean {
      return hasAtLeastOneError(this.mFA, this.allSortedGearRequests);
    },
    hasAtLeastOneWarning(): boolean {
      return hasAtLeastOneWarning(this.mFA, this.allSortedGearRequests);
    },

    generalErrors(): string[] {
      return generalErrors(this.mFA);
    },
    hasGeneralErrors(): boolean {
      return this.generalErrors.length > 0;
    },

    detailErrors(): string[] {
      return detailErrors(this.mFA);
    },
    hasDetailErrors(): boolean {
      return this.detailErrors.length > 0;
    },
    detailWarnings(): string[] {
      return detailWarnings(this.mFA);
    },
    hasDetailWarnings(): boolean {
      return this.detailWarnings.length > 0;
    },

    signaErrors(): string[] {
      return signaErrors(this.mFA);
    },
    hasSignaErrors(): boolean {
      return this.signaErrors.length > 0;
    },
    signaWarnings(): string[] {
      return signaWarnings(this.mFA);
    },
    hasSignaWarnings(): boolean {
      return this.signaWarnings.length > 0;
    },

    timeWindowsErrors(): string[] {
      return timeWindowsErrors(this.mFA);
    },
    hasTimeWindowsErrors(): boolean {
      return this.timeWindowsErrors.length > 0;
    },

    securityErrors(): string[] {
      return securityErrors(this.mFA);
    },
    hasSecurityErrors(): boolean {
      return this.securityErrors.length > 0;
    },
    securityWarnings(): string[] {
      return securityWarnings(this.mFA);
    },
    hasSecurityWarnings(): boolean {
      return this.securityWarnings.length > 0;
    },

    collaboratorErrors(): string[] {
      return collaboratorErrors(this.mFA);
    },
    hasCollaboratorErrors(): boolean {
      return this.collaboratorErrors.length > 0;
    },
    collaboratorWarnings(): string[] {
      return collaboratorWarnings(this.mFA);
    },
    hasCollaboratorWarnings(): boolean {
      return this.collaboratorWarnings.length > 0;
    },

    gearRequestErrors(): string[] {
      return gearRequestErrors(this.allSortedGearRequests);
    },
    hasGearRequestErrors(): boolean {
      return this.gearRequestErrors.length > 0;
    },
    gearRequestWarnings(): string[] {
      return gearRequestWarnings(this.allSortedGearRequests);
    },
    hasGearRequestWarnings(): boolean {
      return this.gearRequestWarnings.length > 0;
    },

    elecWarnings(): string[] {
      return elecWarnings(this.mFA);
    },
    hasElecWarnings(): boolean {
      return this.elecWarnings.length > 0;
    },

    waterWarnings(): string[] {
      return waterWarnings(this.mFA);
    },
    hasWaterWarnings(): boolean {
      return this.waterWarnings.length > 0;
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
