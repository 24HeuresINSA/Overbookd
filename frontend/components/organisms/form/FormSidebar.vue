<template>
  <v-list v-if="form === 'FA'">
    <v-subheader>SOMMAIRE</v-subheader>
    <v-list-item
      v-for="item in faItems"
      :key="item.id"
      :data="item"
      :href="'#' + item.id"
    >
      <v-list-item-icon v-if="!item.isDisabled">
        <v-icon v-text="item.icon"></v-icon>
      </v-list-item-icon>
      <v-list-item-content v-if="!item.isDisabled">
        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>

  <v-list v-else-if="form === 'FT'">
    <v-subheader>SOMMAIRE</v-subheader>
    <v-list-item
      v-for="item in ftItems"
      :key="item.id"
      :data="item"
      :href="'#' + item.id"
    >
      <v-list-item-icon v-if="!item.isDisabled">
        <v-icon v-text="item.icon"></v-icon>
      </v-list-item-icon>
      <v-list-item-content v-if="!item.isDisabled">
        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "FormSidebar",
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
      { id: "elec", text: "Besoin Elec", icon: "mdi-flash" },
      { id: "water", text: "Besoin Eau", icon: "mdi-water" },
      { id: "comment", text: "Commentaires", icon: "mdi-comment" },
      {
        id: "ft",
        text: "FT",
        icon: "mdi-format-color-highlight",
        isDisabled: true,
      },
    ],
    ftItems: [
      {
        id: "ft",
        text: "FT",
        icon: "mdi-format-color-highlight",
        isDisabled: false,
      },
    ],
  }),
});
</script>

<style scoped></style>
