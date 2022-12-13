<template>
  <v-card>
    <h1>🤔 T'es sûr que t'as rien oublié ? 🤔</h1>
    <div v-show="hasError" class="my-container my-3">
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
    <div v-show="hasWarning" class="my-container my-3">
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
        :disabled="hasError"
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
  hasAtLeastOneAnimationTimeWindow,
  hasAtLeastOneBarrieresGearRequest,
  hasAtLeastOneElecGearRequest,
  hasAtLeastOneMatosGearRequest,
  hasBarrieresGearRequestWithQuantityHigherThanZero,
  hasCollaboratorMandatoryFieldsFilled,
  hasCollaboratorOptionalFieldsFilled,
  hasDescriptionToPublish,
  hasElecGearRequestWithQuantityHigherThanZero,
  hasElecNeeds,
  hasInCharge,
  hasLocation,
  hasMatosGearRequestWithQuantityHigherThanZero,
  hasName,
  hasPassNumberHigherThanZero,
  hasPhotoLinkToPublish,
  hasSecurityNeeds,
  hasSignaNeeds,
  hasSignaNeedsWithQuantityHigherThanZero,
  hasTeam,
  hasType,
  hasWaterNeeds,
  isCollaboratorNotEmpty,
  isPublishable,
} from "~/utils/rules/faValidationRules";
import { collaborator } from "~/utils/models/FA";

export default Vue.extend({
  name: "CheckBeforeSubmitCard",
  computed: {
    store(): any {
      return this.$accessor.FA;
    },

    hasError(): boolean {
      return Boolean(
        this.generalErrors.length > 0 ||
          this.detailErrors.length > 0 ||
          this.signaErrors.length > 0 ||
          this.timeWindowsErrors.length > 0 ||
          this.securityErrors.length > 0 ||
          this.collaboratorErrors.length > 0 ||
          this.gearRequestErrors.length > 0
      );
    },
    hasWarning(): boolean {
      return (
        this.detailWarnings.length > 0 ||
        this.signaWarnings.length > 0 ||
        this.securityWarnings.length > 0 ||
        this.collaboratorWarnings.length > 0 ||
        this.gearRequestWarnings.length > 0 ||
        this.elecWarnings.length > 0 ||
        this.waterWarnings.length > 0
      );
    },

    // General
    generalErrors(): string[] {
      return [
        hasName(this.store.mFA.name),
        hasType(this.store.mFA.type),
        hasTeam(this.store.mFA.team_id),
        hasInCharge(this.store.mFA.in_charge),
      ].filter((error): error is string => error !== true);
    },

    // Detail
    detailErrors(): string[] {
      return [
        hasDescriptionToPublish(this.store.mFA),
        hasPhotoLinkToPublish(this.store.mFA),
      ].filter((error): error is string => error !== true);
    },
    detailWarnings(): string[] {
      return [isPublishable(this.store.mFA.is_publishable)].filter(
        (warning): warning is string => warning !== true
      );
    },

    // Signa
    signaErrors(): string[] {
      return [
        hasLocation(this.store.mFA.location_id),
        hasSignaNeedsWithQuantityHigherThanZero(this.store.mFA.fa_signa_needs),
      ].filter((error): error is string => error !== true);
    },
    signaWarnings(): string[] {
      return [hasSignaNeeds(this.store.mFA.fa_signa_needs)].filter(
        (warning): warning is string => warning !== true
      );
    },

    // Time windows
    timeWindowsErrors(): string[] {
      return [
        hasAtLeastOneAnimationTimeWindow(this.store.mFA.time_windows),
      ].filter((error): error is string => error !== true);
    },

    // Security
    securityErrors(): string[] {
      return [hasPassNumberHigherThanZero(this.store.mFA)].filter(
        (error): error is string => error !== true
      );
    },
    securityWarnings(): string[] {
      return [hasSecurityNeeds(this.store.mFA.security_needs)].filter(
        (error): error is string => error !== true
      );
    },

    // Collaborator
    collaborator(): collaborator {
      return this.store.mFA.fa_collaborators[0]?.collaborator;
    },
    collaboratorErrors(): string[] {
      return [hasCollaboratorMandatoryFieldsFilled(this.collaborator)].filter(
        (error): error is string => error !== true
      );
    },
    collaboratorWarnings(): string[] {
      return [
        isCollaboratorNotEmpty(this.collaborator),
        hasCollaboratorOptionalFieldsFilled(this.collaborator),
      ].filter((warning): warning is string => warning !== true);
    },

    // Gear Request
    gearRequestWarnings(): string[] {
      return [
        hasAtLeastOneMatosGearRequest(this.store.matosGearRequests),
        hasAtLeastOneBarrieresGearRequest(this.store.barrieresGearRequests),
        hasAtLeastOneElecGearRequest(this.store.elecGearRequests),
      ].filter((warning): warning is string => warning !== true);
    },
    gearRequestErrors(): string[] {
      return [
        hasMatosGearRequestWithQuantityHigherThanZero(
          this.store.matosGearRequests
        ),
        hasBarrieresGearRequestWithQuantityHigherThanZero(
          this.store.barrieresGearRequests
        ),
        hasElecGearRequestWithQuantityHigherThanZero(
          this.store.elecGearRequests
        ),
      ].filter((error): error is string => error !== true);
    },

    // Elec
    elecWarnings(): string[] {
      return [hasElecNeeds(this.store.mFA.fa_electricity_needs)].filter(
        (warning): warning is string => warning !== true
      );
    },

    // Water
    waterWarnings(): string[] {
      return [hasWaterNeeds(this.store.mFA.water_needs)].filter(
        (warning): warning is string => warning !== true
      );
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
