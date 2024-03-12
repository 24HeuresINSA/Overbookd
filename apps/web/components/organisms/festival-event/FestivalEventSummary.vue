<template>
  <v-list>
    <v-subheader>SOMMAIRE</v-subheader>
    <v-list-item
      v-for="item in items"
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

type SummaryItem = {
  id: string;
  text: string;
  icon: string;
};

export default Vue.extend({
  name: "FestivalEventSummary",
  props: {
    festivalEvent: {
      type: String,
      default: () => "FA",
    },
  },
  data: () => ({
    faItems: [
      { id: "general", text: "Général", icon: "mdi-card-text" },
      { id: "in-charge", text: "Responsable", icon: "mdi-account-group" },
      { id: "signa", text: "Signa", icon: "mdi-routes" },
      { id: "security", text: "Sécurité", icon: "mdi-shield" },
      { id: "supply", text: "Besoin en elec/eau", icon: "mdi-flash" },
      { id: "inquiry", text: "Logistique", icon: "mdi-truck" },
      { id: "feedback", text: "Commentaires", icon: "mdi-comment" },
      { id: "ft", text: "FT", icon: "mdi-format-color-highlight" },
    ],
    ftItems: [
      { id: "general", text: "Général", icon: "mdi-card-text" },
      { id: "fa", text: "FA associée", icon: "mdi-chart-bubble" },
      { id: "inquiry", text: "Demandes de matos", icon: "mdi-truck" },
      {
        id: "instructions",
        text: "Instructions",
        icon: "mdi-order-bool-descending-variant",
      },
      { id: "mobilization", text: "Mobilisations", icon: "mdi-calendar-badge" },
      { id: "feedback", text: "Commentaires", icon: "mdi-comment" },
    ],
  }),
  computed: {
    items(): SummaryItem[] {
      return this.festivalEvent === "FA" ? this.faItems : this.ftItems;
    },
  },
});
</script>
