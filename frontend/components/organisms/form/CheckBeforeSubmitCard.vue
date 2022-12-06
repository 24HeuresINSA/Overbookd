<template>
  <v-card>
    <v-card-title>⚠️ Vérification de la FA ⚠️</v-card-title>
    <!--<v-card-subtitle>T'es sur de ta merde là ?</v-card-subtitle>-->

    <v-container v-if="!noError">
      <h3>⚠️ Erreurs ⚠️</h3>
      <div v-if="generalErrors.length > 0">
        <h4>Général</h4>
        <ul>
          <li v-for="label in generalErrors" :key="label">
            {{ label }}
          </li>
        </ul>
      </div>

      <div v-if="detailErrors.length > 0">
        <h4>Détail</h4>
        <ul>
          <li v-for="label in detailErrors" :key="label">
            {{ label }}
          </li>
        </ul>
      </div>
    </v-container>

    <v-container v-if="!noWarning">
      <h3>⚠️ Avertissements ⚠️</h3>
      <div v-if="detailWarning.length > 0">
        <h4>Détail</h4>
        <ul>
          <li v-for="label in detailWarning" :key="label">
            {{ label }}
          </li>
        </ul>
      </div>
    </v-container>

    <v-divider></v-divider>
    <v-card-actions>
      <v-btn color="blue darken-1" text @click="cancel"> Annuler </v-btn>
      <v-spacer></v-spacer>
      <v-btn :disabled="!noError" color="blue darken-1" text @click="submit">
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

    noError(): boolean {
      return this.generalErrors.length === 0 && this.detailErrors.length === 0;
    },
    noWarning(): boolean {
      return this.detailWarning.length === 0;
    },

    generalErrors(): string[] {
      const fields: Field[] = [
        { key: "name", label: "Nom" },
        { key: "type", label: "Type" },
        { key: "team_id", label: "Team" },
        { key: "in_charge", label: "Responsable" },
      ];

      let messages: string[] = [];
      fields.forEach((field) => {
        if (!this.store.mFA[field.key]) {
          messages.push(`Le champ ${field.label} est vide.`);
        }
      });
      return messages;
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

      let messages: string[] = [];
      if (this.store.mFA.is_publishable) {
        fields.forEach((field) => {
          if (!this.store.mFA[field.key]) {
            messages.push(field.label);
          }
        });
      }
      return messages;
    },

    detailWarning(): string[] {
      if (!this.store.mFA.is_publishable) {
        return ["Cette activité ne sera pas publié sur le site."];
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
