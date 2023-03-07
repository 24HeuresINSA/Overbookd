<template>
  <div>
    <h2>Matos</h2>
    <form class="filter">
      <v-text-field
        v-model="name"
        append-icon="mdi-hammer-screwdriver"
        label="Nom du matos"
        autofocus
        clearable
        clear-icon="mdi-close-circle-outline"
        :disabled="loading"
        counter
        @input="defectSearchGears"
        @keydown="searchOnEnter"
      ></v-text-field>
      <SearchCategory
        v-model="category"
        :boxed="false"
        @change="searchGears"
      ></SearchCategory>
      <SearchTeam
        v-model="team"
        label="Choissisez l'equipe responsable"
        :boxed="false"
        @change="searchGears"
      ></SearchTeam>
    </form>
    <v-data-table
      :headers="headers"
      :items="gears"
      :name="name"
      :category="category"
      :loading="loading"
    >
      <template #item.isPonctualUsage="{ item }">
        <v-switch
          :input-value="item.isPonctualUsage"
          :disabled="true"
        ></v-switch>
      </template>
      <template #item.isConsumable="{ item }">
        <v-switch :input-value="item.isConsumable" :disabled="true"></v-switch>
      </template>
      <template #item.category="{ item }">
        <div v-show="item.category" class="category-details">
          <span class="category-details__name">{{ item.category?.name }}</span>
          <span class="category-details__path"> {{ item.category?.path }}</span>
        </div>
      </template>
      <template #item.actions="{ item }">
        <v-icon small class="mr-2" @click="openUpdateGearDialog(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="openDeleteGearDialog(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="isUpdateGearDialogOpen" width="600px">
      <GearForm :gear="selectedGear" @close-dialog="closeUpdateGearDialog">
      </GearForm>
    </v-dialog>
    <v-dialog v-model="isDeleteGearDialogOpen" width="600px">
      <ConfirmationMessage
        confirm-color="error"
        @close-dialog="closeDeleteGearDialog"
        @confirm="deleteGear"
      >
        <template #title>Suppression du matos</template>
        <template #statement
          >Vous etes sur le point de supprimer
          <strong>{{ selectedGear?.name }}</strong></template
        >
        <template #confirm-btn-content>
          <v-icon left> mdi-delete </v-icon>Supprimer
        </template>
      </ConfirmationMessage>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GearSearchOptions } from "~/store/catalog";
import { Category, Gear } from "~/utils/models/catalog.model";
import { Header } from "~/utils/models/Data";
import { Team } from "~/utils/models/team";
import ConfirmationMessage from "../atoms/ConfirmationMessage.vue";
import SearchCategory from "../atoms/SearchCategory.vue";
import SearchTeam from "../atoms/SearchTeam.vue";
import GearForm from "./form/GearForm.vue";

interface GearListingData {
  headers: Header[];
  name: string;
  category: Category | null;
  team: Pick<Team, "name" | "code"> | null;
  loading: boolean;
  selectedGear?: Gear;
  isUpdateGearDialogOpen: boolean;
  isDeleteGearDialogOpen: boolean;
  delay: any;
}

export default Vue.extend({
  name: "GearListing",
  components: { GearForm, ConfirmationMessage, SearchTeam, SearchCategory },
  data(): GearListingData {
    return {
      headers: [
        { text: "Matos", value: "name" },
        { text: "Code de reference", value: "code" },
        { text: "Matos d'appoint", value: "isPonctualUsage" },
        { text: "Matos consommable", value: "isConsumable" },
        { text: "Category", value: "category" },
        { text: "Actions", value: "actions" },
      ],
      name: "",
      category: null,
      team: null,
      loading: false,
      selectedGear: undefined,
      isUpdateGearDialogOpen: false,
      isDeleteGearDialogOpen: false,
      delay: undefined,
    };
  },
  computed: {
    gears(): Gear[] {
      return this.$accessor.catalog.gears;
    },
    canSearch(): Boolean {
      return (
        [this.name, this.category?.path, this.team?.code].some((searchOption) =>
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
    async searchGears() {
      if (!this.canSearch) return;
      const searchOptions = this.buildSearchOptions();
      await this.fetchGears(searchOptions);
    },
    searchOnEnter(keyEvent: KeyboardEvent) {
      if (keyEvent.key !== "Enter") return;
      return this.searchGears();
    },
    async fetchGears(searchOptions: GearSearchOptions) {
      this.loading = true;
      await this.$accessor.catalog.fetchGears(searchOptions);
      this.loading = false;
    },
    openUpdateGearDialog(gear: Gear) {
      this.selectedGear = gear;
      this.isUpdateGearDialogOpen = true;
    },
    openDeleteGearDialog(gear: Gear) {
      this.selectedGear = gear;
      this.isDeleteGearDialogOpen = true;
    },
    closeUpdateGearDialog() {
      this.isUpdateGearDialogOpen = false;
    },
    closeDeleteGearDialog() {
      this.isDeleteGearDialogOpen = false;
    },
    isValidSearchOption(searchOption: string | null | undefined): boolean {
      return Boolean(searchOption);
    },
    buildSearchOptions(): GearSearchOptions {
      let searchOptions = {};
      if (this.isValidSearchOption(this.name)) {
        searchOptions = { ...searchOptions, name: this.name };
      }
      if (this.isValidSearchOption(this.category?.path)) {
        searchOptions = { ...searchOptions, category: this.category?.path };
      }
      if (this.isValidSearchOption(this.team?.code)) {
        searchOptions = { ...searchOptions, owner: this.team?.code };
      }
      return searchOptions;
    },
    async deleteGear() {
      if (!this.selectedGear) return;
      await this.$accessor.catalog.deleteGear(this.selectedGear);
    },
    defectSearchGears() {
      if (this.delay) clearInterval(this.delay);
      this.delay = setTimeout(this.searchGears, 500);
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
.category-details {
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin: 0;
  &__path {
    font-size: 0.8rem;
    color: gray;
  }
}
</style>
