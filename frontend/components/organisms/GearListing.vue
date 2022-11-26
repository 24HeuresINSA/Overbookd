<template>
  <div>
    <h2>Matos</h2>
    <form class="filter">
      <v-text-field
        v-model="name"
        append-icon="mdi-hammer-screwdriver"
        label="Nom du matos"
        single-line
        clearable
        clear-icon="mdi-close-circle-outline"
        :disabled="loading"
        counter
        :rules="[searchRules.minLength]"
        @input="searchGears"
      ></v-text-field>
      <v-text-field
        v-model="category"
        append-icon="mdi-label"
        label="Nom de la categorie"
        single-line
        clearable
        clear-icon="mdi-close-circle-outline"
        :disabled="loading"
        counter
        :rules="[searchRules.minLength]"
        @input="searchGears"
      ></v-text-field>
      <v-text-field
        v-model="team"
        append-icon="mdi-account-multiple"
        label="Nom de l'equipe responsable"
        single-line
        clearable
        clear-icon="mdi-close-circle-outline"
        :disabled="loading"
        counter
        :rules="[searchRules.minLength]"
        @input="searchGears"
      ></v-text-field>
    </form>
    <v-data-table
      :headers="headers"
      :items="gears"
      :name="name"
      :category="category"
      :loading="loading"
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
import { GearSearchOptions } from "~/store/catalog";
import { Gear } from "~/utils/models/catalog.model";
import { Header } from "~/utils/models/Data";

interface GearListingData {
  headers: Header[];
  name: string;
  category: string;
  team: string;
  searchRules: {
    minLength: (value: string | null) => boolean | string;
  };
  loading: boolean;
  searchDelay?: any;
}

const searchMinLength = 3;

export default Vue.extend({
  name: "GearListing",
  data(): GearListingData {
    return {
      headers: [
        { text: "Matos", value: "name" },
        { text: "Category", value: "category" },
        { text: "Actions", value: "actions" },
      ],
      name: "",
      category: "",
      team: "",
      searchRules: {
        minLength: (value) =>
          !value ||
          value.length >= searchMinLength ||
          `Taper au moins ${searchMinLength} caracteres`,
      },
      loading: false,
      searchDelay: undefined,
    };
  },
  computed: {
    gears(): Gear[] {
      return this.$accessor.catalog.gears;
    },
    canSearch(): Boolean {
      return (
        [this.name, this.category, this.team].some((searchOption) =>
          this.isValidSearchOption(searchOption)
        ) ||
        [this.name, this.category, this.team].every(
          (searchOption) => !searchOption
        )
      );
    },
  },
  beforeMount() {
    this.fetchGears({});
  },
  methods: {
    searchGears() {
      if (!this.canSearch) return;
      const searchOptions = this.buildSearchOptions();
      this.waitForUserTypingBerforeAction(() => this.fetchGears(searchOptions));
    },
    async fetchGears(searchOptions: GearSearchOptions) {
      this.loading = true;
      await this.$accessor.catalog.fetchGears(searchOptions);
      this.loading = false;
    },
    isValidSearchOption(searchOption: string | null): boolean {
      return Boolean(searchOption && searchOption.length >= searchMinLength);
    },
    buildSearchOptions(): GearSearchOptions {
      let searchOptions = {};
      if (this.isValidSearchOption(this.name)) {
        searchOptions = { ...searchOptions, name: this.name };
      }
      if (this.isValidSearchOption(this.category)) {
        searchOptions = { ...searchOptions, category: this.category };
      }
      if (this.isValidSearchOption(this.team)) {
        searchOptions = { ...searchOptions, owner: this.team };
      }
      return searchOptions;
    },
    waitForUserTypingBerforeAction(action: () => Promise<any>) {
      if (this.searchDelay) clearTimeout(this.searchDelay);

      this.searchDelay = setTimeout(action, 300);
    },
  },
});
</script>

<style lang="scss">
form {
  margin-bottom: 1.2rem;
}
.filter {
  display: flex;
  gap: 5%;
  justify-content: space-evenly;
  .v-input {
    flex-grow: 1;
  }
}
</style>
