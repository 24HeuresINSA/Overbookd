<template>
  <v-card>
    <h1>🤔 T'es sûr que t'as rien oublié ? 🤔</h1>
    <div v-show="hasError" class="my-container my-3">
      <h3>❌ Erreurs ❌</h3>
      <p class="important">
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

      <div v-show="timeWindowErrors.length > 0">
        <h4>Créneaux</h4>
        <ul>
          <li v-for="label in timeWindowErrors" :key="label">{{ label }}</li>
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

      <div v-show="logisticsWarnings.length > 0">
        <h4>Logistique</h4>
        <ul>
          <li v-for="label in logisticsWarnings" :key="label">{{ label }}</li>
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
import { collaborator } from "~/utils/models/FA";

export default Vue.extend({
  name: "CheckBeforeSubmitCard",
  computed: {
    store(): any {
      return this.$accessor.FA;
    },

    hasError(): boolean {
      return (
        this.generalErrors.length > 0 ||
        this.detailErrors.length > 0 ||
        this.signaErrors.length > 0 ||
        this.timeWindowErrors.length > 0 ||
        this.securityErrors.length > 0 ||
        this.collaboratorErrors.length > 0
      );
    },
    hasWarning(): boolean {
      return (
        this.detailWarnings.length > 0 ||
        this.signaWarnings.length > 0 ||
        this.securityWarnings.length > 0 ||
        this.collaboratorWarnings.length > 0 ||
        this.logisticsWarnings.length > 0 ||
        this.elecWarnings.length > 0 ||
        this.waterWarnings.length > 0
      );
    },

    generalErrors(): string[] {
      const fields: Field[] = [
        { key: "name", label: "Nom" },
        { key: "type", label: "Type" },
        { key: "team_id", label: "Team" },
        { key: "in_charge", label: "Responsable" },
      ];

      return fields
        .filter((field) => !this.store.mFA[field.key])
        .map((field) => `Le champ ${field.label} est vide.`);
    },

    detailErrors(): string[] {
      const fields: Field[] = [
        {
          key: "description",
          label: "La desciription à publier sur le site est vide.",
        },
        {
          key: "photo_link",
          label: "Le lien de la photo à publier sur le site est vide.",
        },
      ];

      if (!this.store.mFA.is_publishable) return [];
      return fields
        .filter((field) => !this.store.mFA[field.key])
        .map((field) => field.label);
    },
    detailWarnings(): string[] {
      if (!this.store.mFA.is_publishable) {
        return ["Cette activité ne sera pas publié sur le site."];
      }
      return [];
    },

    signaErrors(): string[] {
      if (!this.store.mFA.location_id) {
        return ["Cette activité n'a pas de lieu."];
      }
      return [];
    },
    signaWarnings(): string[] {
      if (this.store.mFA.fa_signa_needs?.length === 0) {
        return ["Cette activité n'a pas de signalisation."];
      }
      return [];
    },

    timeWindowErrors(): string[] {
      if (this.store.animationTimeWindows?.length === 0) {
        return ["Cette activité n'a pas de créneaux."];
      }
      return [];
    },

    securityErrors(): string[] {
      if (this.store.mFA.is_pass_required && !this.store.mFA.number_of_pass) {
        return ["Le nombre de Pass Sécu nécessaire n'est pas précisé."];
      }
      return [];
    },
    securityWarnings(): string[] {
      if (!this.store.mFA.security_needs) {
        return [
          "Cette activité n'a pas de dispositif de sécurité particulier.",
        ];
      }
      return [];
    },

    collaboratorErrors(): string[] {
      const collaborator = this.store.mFA.fa_collaborators[0]?.collaborator;
      if (
        collaborator &&
        this.isCollaboratorEssentialDataIncomplete(collaborator)
      ) {
        return [
          "Les informations indispensables du prestataire sont incomplètes.",
        ];
      }
      return [];
    },
    collaboratorWarnings(): string[] {
      const collaborator = this.store.mFA.fa_collaborators[0]?.collaborator;
      if (!collaborator || this.isCollaboratorEmpty(collaborator)) {
        return ["Cette activité n'a pas de prestataire."];
      }

      if (
        collaborator &&
        this.isCollaboratorOptionalDataIncomplete(collaborator)
      ) {
        return ["Les informations du prestataire sont incomplètes."];
      }
      return [];
    },

    logisticsWarnings(): string[] {
      const fields: Field[] = [
        { key: "matosGearRequests", label: "Matos" },
        { key: "barrieresGearRequests", label: "Barrières" },
        { key: "elecGearRequests", label: "Matos Elec / Eau" },
      ];
      return fields
        .filter((field) => this.store[field.key]?.length === 0)
        .map((field) => `Ton activité n'a pas de ${field.label}.`);
    },

    elecWarnings(): string[] {
      if (this.store.mFA.fa_electricity_needs.length === 0) {
        return ["Cette activité n'a pas besoin d'électricité."];
      }
      return [];
    },

    waterWarnings(): string[] {
      if (!this.store.mFA.water_needs) {
        return ["Cette activité n'a pas besoin d'eau."];
      }
      return [];
    },
  },
  methods: {
    isCollaboratorEssentialDataIncomplete(collaborator: collaborator): boolean {
      return (
        !collaborator.firstname || !collaborator.lastname || !collaborator.phone
      );
    },
    isCollaboratorOptionalDataIncomplete(collaborator: collaborator): boolean {
      return (
        !!collaborator.firstname &&
        !!collaborator.lastname &&
        !!collaborator.phone &&
        (!collaborator.email || !collaborator.company || !collaborator.comment)
      );
    },
    isCollaboratorEmpty(collaborator: collaborator): boolean {
      return Object.keys(collaborator).every((key) => {
        return !collaborator[key as keyof collaborator];
      });
    },
  },
});

interface Field {
  key: string;
  label: string;
}
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 1.8rem;
  padding: 10px 0;
}

.my-container {
  margin: 0 1.2rem;
}

.my-container h3 {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0.5rem 0 0 0;
  text-align: center;
}

.my-container h4 {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0.5rem 0 0 0;
}

.important {
  color: red;
  font-weight: bold;
  text-align: center;
}
</style>
