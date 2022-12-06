<template>
  <v-card>
    <v-card-title>⚠️ Vérification de la FA ⚠️</v-card-title>
    <!--<v-card-subtitle>T'es sur de ta merde là ?</v-card-subtitle>-->

    <v-container v-show="hasError">
      <h3>⚠️ Erreurs ⚠️</h3>
      <div v-show="generalErrors.length > 0">
        <h4>Général</h4>
        <ul>
          <li v-for="label in generalErrors" :key="label">
            {{ label }}
          </li>
        </ul>
      </div>

      <div v-show="detailErrors.length > 0">
        <h4>Détail</h4>
        <ul>
          <li v-for="label in detailErrors" :key="label">
            {{ label }}
          </li>
        </ul>
      </div>
    </v-container>

    <v-container v-show="hasWarning">
      <h3>⚠️ Avertissements ⚠️</h3>
      <div v-show="detailWarning.length > 0">
        <h4>Détail</h4>
        <ul>
          <li v-for="label in detailWarning" :key="label">
            {{ label }}
          </li>
        </ul>
      </div>

      <div v-show="securityWarning.length > 0">
        <h4>Détail</h4>
        <ul>
          <li v-for="label in securityWarning" :key="label">
            {{ label }}
          </li>
        </ul>
      </div>

      <div v-show="prestaWarning.length > 0">
        <h4>Détail</h4>
        <ul>
          <li v-for="label in prestaWarning" :key="label">
            {{ label }}
          </li>
        </ul>
      </div>

      <div v-show="elecWarning.length > 0">
        <h4>Besoin d'électricité</h4>
        <ul>
          <li v-for="label in elecWarning" :key="label">
            {{ label }}
          </li>
        </ul>
      </div>

      <div v-show="waterWarning.length > 0">
        <h4>Besoin d'eau</h4>
        <ul>
          <li v-for="label in waterWarning" :key="label">
            {{ label }}
          </li>
        </ul>
      </div>
    </v-container>

    <v-divider></v-divider>
    <v-card-actions>
      <v-btn color="blue darken-1" text @click="cancel"> Annuler </v-btn>
      <v-spacer></v-spacer>
      <v-btn :disabled="hasError" color="blue darken-1" text @click="submit">
        Soumettre
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CheckBeforeSubmitCard",
  props: {
    form: {
      type: String,
      default: () => "FA",
    },
  },
  computed: {
    store(): any {
      if (this.form === "FA") {
        return this.$accessor.FA;
      }
      return this.$accessor.FT;
    },

    hasError(): boolean {
      return this.generalErrors.length > 0 || this.detailErrors.length > 0;
    },
    hasWarning(): boolean {
      return this.detailWarning.length > 0;
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
        .map((field) => field.label);
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
    detailWarning(): string[] {
      if (!this.store.mFA.is_publishable) {
        return ["Cette activité ne sera pas publié sur le site."];
      }
      return [];
    },

    securityError(): string[] {
      return [];
    },
    securityWarning(): string[] {
      return [];
    },

    prestaError(): string[] {
      return [];
    },
    prestaWarning(): string[] {
      return [];
    },

    elecWarning(): string[] {
      if (this.store.mFA.fa_electricity_needs.length === 0) {
        return ["Cette activité n'a pas besoin d'électricité."];
      }
      return [];
    },

    waterWarning(): string[] {
      if (!this.store.mFA.water_needs) {
        return ["Cette activité n'a pas besoin d'eau."];
      }
      return [];
    },
  },
  methods: {
    cancel() {
      console.log("cancel");
    },
    submit() {
      console.log("submit");
    },
  },
});

interface Field {
  key: string;
  label: string;
}
</script>

<style scoped></style>
