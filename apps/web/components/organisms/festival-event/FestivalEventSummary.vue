<template>
  <v-list density="comfortable">
    <v-list-subheader>SOMMAIRE</v-list-subheader>
    <v-list-item
      v-for="item in items"
      :key="item.value"
      :href="'#' + item.value"
      :prepend-icon="item.icon"
      :title="item.title"
    />
  </v-list>
</template>

<script lang="ts" setup>
import type { FestivalEventIdentifier } from "@overbookd/festival-event";

const props = defineProps({
  festivalEvent: {
    type: String as PropType<FestivalEventIdentifier>,
    default: "FA",
  },
});

type SummaryItem = {
  value: string;
  title: string;
  icon: string;
};

const faItems: SummaryItem[] = [
  { value: "general", title: "Général", icon: "mdi-card-text" },
  { value: "in-charge", title: "Responsable", icon: "mdi-account-group" },
  { value: "signa", title: "Signa", icon: "mdi-routes" },
  { value: "security", title: "Sécurité", icon: "mdi-shield" },
  { value: "supply", title: "Besoin en elec/eau", icon: "mdi-flash" },
  { value: "inquiry", title: "Logistique", icon: "mdi-truck" },
  { value: "feedback", title: "Commentaires", icon: "mdi-comment" },
  { value: "ft", title: "FT", icon: "mdi-format-color-highlight" },
];
const ftItems: SummaryItem[] = [
  { value: "general", title: "Général", icon: "mdi-card-text" },
  { value: "fa", title: "FA associée", icon: "mdi-chart-bubble" },
  { value: "inquiry", title: "Demandes de matos", icon: "mdi-truck" },
  {
    value: "instructions",
    title: "Instructions",
    icon: "mdi-order-bool-descending-variant",
  },
  { value: "mobilization", title: "Mobilisations", icon: "mdi-calendar-badge" },
  { value: "feedback", title: "Commentaires", icon: "mdi-comment" },
];

const items = computed<SummaryItem[]>(() =>
  props.festivalEvent === "FA" ? faItems : ftItems,
);
</script>
