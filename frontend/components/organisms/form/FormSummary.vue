<template>
  <v-list>
    <v-subheader>SOMMAIRE</v-subheader>
    <v-list-item
      v-for="item in form === 'FA' ? faItems : ftItems"
      :key="item.id"
      :data="item"
      :href="'#' + item.id"
    >
      <v-list-item-icon>
        <v-icon v-text="item.icon"></v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "FormSummary",
  props: {
    form: {
      type: String,
      default: () => "FA",
    },
  },
  data: () => ({
    faItems: [
      { id: "general", text: "Général", icon: "mdi-card-text" },
      { id: "detail", text: "Détail", icon: "mdi-text-box" },
      { id: "signa", text: "Signa", icon: "mdi-routes" },
      { id: "timeframe", text: "Créneaux", icon: "mdi-calendar-clock" },
      { id: "security", text: "Sécurité", icon: "mdi-shield" },
      { id: "presta", text: "Presta", icon: "mdi-account" },
      { id: "log", text: "Logistique", icon: "mdi-truck" },
      { id: "elec", text: "Besoin Elec", icon: "mdi-flash" },
      { id: "water", text: "Besoin Eau", icon: "mdi-water" },
      { id: "comment", text: "Commentaires", icon: "mdi-comment" },
      // { id: "ft", text: "FT", icon: "mdi-format-color-highlight" },
    ],
    ftItems: [
      { id: "general", text: "Général", icon: "mdi-card-text" },
      { id: "fa", text: "FA associée", icon: "mdi-chart-bubble" },
      { id: "detail", text: "Détail", icon: "mdi-text-box" },
      { id: "timeframe", text: "Créneaux", icon: "mdi-calendar-clock" },
      { id: "matos", text: "Matos", icon: "mdi-truck" },
      { id: "comment", text: "Commentaires", icon: "mdi-comment" },
    ],
  }),
});
</script>

<style scoped></style>
