<template>
  <div>
    <h1>Catalogue</h1>
    <div class="filter">
      <v-text-field
        v-model="name"
        append-icon="mdi-hammer-screwdriver"
        label="Nom du matos"
        single-line
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      ></v-text-field>
      <v-text-field
        v-model="category"
        append-icon="mdi-label"
        label="Nom de la category"
        single-line
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      ></v-text-field>
      <v-text-field
        v-model="team"
        append-icon="mdi-account-multiple"
        label="Nom de l'equipe responsable"
        single-line
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      ></v-text-field>
    </div>
    <v-data-table
      :headers="headers"
      :items="gears"
      :name="name"
      :category="category"
    >
      <template #item.category="{ item }">
        {{ item.category && item.category.name }}
      </template>
      <template #item.actions="{ item }">
        <v-icon small class="mr-2"> mdi-pencil </v-icon>
        <v-icon small> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Header } from "~/utils/models/Data";

interface Gear {
  id: number;
  name: string;
  slug: string;
  category?: {
    id: number;
    name: string;
    path: string;
  };
}

interface CatalogData {
  headers: Header[];
  gears: Gear[];
  name: string;
  category: string;
  team: string;
}

export default Vue.extend({
  name: "Catalog",
  data(): CatalogData {
    return {
      headers: [
        { text: "Matos", value: "name" },
        { text: "Category", value: "category" },
        { text: "Actions", value: "actions" },
      ],
      gears: [
        {
          name: "Marteau",
          category: {
            id: 1,
            name: "Outils",
            path: "outils",
          },
          slug: "marteau",
          id: 1,
        },
        {
          name: "Perceuse",
          category: {
            id: 1,
            name: "Outils",
            path: "outils",
          },
          slug: "perceuse",
          id: 2,
        },
        {
          name: "Tournevis",
          category: {
            id: 1,
            name: "Outils",
            path: "outils",
          },
          slug: "tournevis",
          id: 3,
        },
        {
          name: "Rallonge 3m",
          category: {
            id: 4,
            name: "Rallonges",
            path: "electrique->cables->rallonges",
          },
          slug: "rallonge-3m",
          id: 4,
        },
        {
          name: "Rallonge 10m",
          category: {
            id: 4,
            name: "Rallonges",
            path: "electrique->cables->rallonges",
          },
          slug: "rallonge-10m",
          id: 5,
        },
        {
          name: "Tireuse",
          slug: "tireuse",
          id: 6,
        },
      ],
      name: "",
      category: "",
      team: "",
    };
  },
});
</script>

<style lang="scss">
.filter {
  display: flex;
  gap: 5%;
  justify-content: space-evenly;
  .v-input {
    flex-grow: 1;
  }
}
.custom-label {
  align-items: flex-start;
}
.gear {
  display: flex;
  justify-content: start;
  gap: 30px;
  &__name {
    display: flex;
    justify-content: start;
    gap: 10px;
  }
  &__actions {
    i {
      margin: 0;
    }
  }
}
</style>
