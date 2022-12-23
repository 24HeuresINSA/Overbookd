<template>
  <v-card>
    <h1>🤔 T'es sûr que t'as rien oublié ? 🤔</h1>
    <div v-show="hasAtLeatOneError" class="my-container my-3">
      <h3>❌ Erreurs ❌</h3>
      <p class="important text-center">
        Tu dois corriger toutes les erreurs pour soumettre ta FA à validation !
      </p>
      <div v-show="generalErrors.length > 0">
        <h4>Général</h4>
        <ul>
          <li v-for="label in generalErrors" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="detailErrors.length > 0">
        <h4>Détail</h4>
        <ul>
          <li v-for="label in detailErrors" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="signaErrors.length > 0">
        <h4>Signa</h4>
        <ul>
          <li v-for="label in signaErrors" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="timeWindowsErrors.length > 0">
        <h4>Créneaux</h4>
        <ul>
          <li v-for="label in timeWindowsErrors" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="securityErrors.length > 0">
        <h4>Securité</h4>
        <ul>
          <li v-for="label in securityErrors" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="collaboratorErrors.length > 0">
        <h4>Presta</h4>
        <ul>
          <li v-for="label in collaboratorErrors" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="gearRequestErrors.length > 0">
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

      <div v-show="signaWarnings.length > 0">
        <h4>Signa</h4>
        <ul>
          <li v-for="label in signaWarnings" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="securityWarnings.length > 0">
        <h4>Securité</h4>
        <ul>
          <li v-for="label in securityWarnings" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="collaboratorWarnings.length > 0">
        <h4>Presta</h4>
        <ul>
          <li v-for="label in collaboratorWarnings" :key="label">
            {{ label }}
          </li>
        </ul>
      </div>

      <div v-show="gearRequestWarnings.length > 0">
        <h4>Logistique</h4>
        <ul>
          <li v-for="label in gearRequestWarnings" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="elecWarnings.length > 0">
        <h4>Besoin d'électricité</h4>
        <ul>
          <li v-for="label in elecWarnings" :key="label">{{ label }}</li>
        </ul>
      </div>

      <div v-show="waterWarnings.length > 0">
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
  hasGeneralErrors,
  hasDetailErrors,
  hasDetailWarnings,
  hasSignaErrors,
  hasSignaWarnings,
  hasTimeWindowsErrors,
  hasSecurityErrors,
  hasSecurityWarnings,
  hasCollaboratorErrors,
  hasCollaboratorWarnings,
  hasGearRequestErrors,
  hasGearRequestWarnings,
  hasElecWarnings,
  hasWaterWarnings,
} from "~/utils/rules/faValidationRules";

export default Vue.extend({
  name: "CheckBeforeSubmitCard",
  computed: {
    store(): any {
      return this.$accessor.FA;
    },

    hasAtLeatOneError(): boolean {
      return hasAtLeastOneError(this.store);
    },
    hasAtLeastOneWarning(): boolean {
      return hasAtLeastOneWarning(this.store);
    },

    // General
    generalErrors(): string[] {
      return hasGeneralErrors(this.store.mFA);
    },

    // Detail
    detailErrors(): string[] {
      return hasDetailErrors(this.store.mFA);
    },
    detailWarnings(): string[] {
      return hasDetailWarnings(this.store.mFA);
    },

    // Signa
    signaErrors(): string[] {
      return hasSignaErrors(this.store.mFA);
    },
    signaWarnings(): string[] {
      return hasSignaWarnings(this.store.mFA);
    },

    // Time windows
    timeWindowsErrors(): string[] {
      return hasTimeWindowsErrors(this.store.mFA);
    },

    // Security
    securityErrors(): string[] {
      return hasSecurityErrors(this.store.mFA);
    },
    securityWarnings(): string[] {
      return hasSecurityWarnings(this.store.mFA);
    },

    // Collaborator
    collaboratorErrors(): string[] {
      return hasCollaboratorErrors(this.store.mFA);
    },
    collaboratorWarnings(): string[] {
      return hasCollaboratorWarnings(this.store.mFA);
    },

    // Gear Request
    gearRequestErrors(): string[] {
      return hasGearRequestErrors(this.store);
    },
    gearRequestWarnings(): string[] {
      return hasGearRequestWarnings(this.store);
    },

    // Elec
    elecWarnings(): string[] {
      return hasElecWarnings(this.store.mFA);
    },

    // Water
    waterWarnings(): string[] {
      return hasWaterWarnings(this.store.mFA);
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
