<template>
  <div>
    <h2>Matos</h2>
    <GearFilter v-model="filter" @change="searchGears" />
    <v-data-table
      :headers="headers"
      :items="gears"
      :name="filter.name"
      :category="filter.category"
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
      <template v-if="isCatalogWriter" #item.actions="{ item }">
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
import { GearSearchOptions } from "@overbookd/http";
import { Gear } from "~/utils/models/catalog.model";
import { Header } from "~/utils/models/data-table.model";
import ConfirmationMessage from "../../atoms/card/ConfirmationMessage.vue";
import GearForm from "../../molecules/logistic/GearForm.vue";
import GearFilter from "../../molecules/logistic/GearFilter.vue";
import { WRITE_GEAR_CATALOG } from "@overbookd/permission";
import { FilterGear } from "~/utils/models/filter-gear.model";

type GearListingData = {
  headers: Header[];
  filter: FilterGear;
  loading: boolean;
  selectedGear?: Gear;
  isUpdateGearDialogOpen: boolean;
  isDeleteGearDialogOpen: boolean;
};

export default Vue.extend({
  name: "GearListing",
  components: {
    GearFilter,
    GearForm,
    ConfirmationMessage,
  },
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
      filter: {
        name: "",
        category: null,
        team: null,
      },
      loading: false,
      selectedGear: undefined,
      isUpdateGearDialogOpen: false,
      isDeleteGearDialogOpen: false,
    };
  },
  computed: {
    gears(): Gear[] {
      return this.$accessor.catalogGear.gears;
    },
    canSearch(): boolean {
      const { name, category, team } = this.filter;
      return (
        [name, category?.path, team?.code].some((searchOption) =>
          this.isValidSearchOption(searchOption),
        ) || [name, category, team].every((searchOption) => !searchOption)
      );
    },
    isCatalogWriter(): boolean {
      return this.$accessor.user.can(WRITE_GEAR_CATALOG);
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
    async fetchGears(searchOptions: GearSearchOptions) {
      this.loading = true;
      await this.$accessor.catalogGear.fetchGears(searchOptions);
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
      const { name, category, team } = this.filter;
      let searchOptions = {};
      if (this.isValidSearchOption(name)) {
        searchOptions = { ...searchOptions, name };
      }
      if (this.isValidSearchOption(category?.path)) {
        searchOptions = { ...searchOptions, category: category?.path };
      }
      if (this.isValidSearchOption(team?.code)) {
        searchOptions = { ...searchOptions, owner: team?.code };
      }
      return searchOptions;
    },
    async deleteGear() {
      if (!this.selectedGear) return;
      await this.$accessor.catalogGear.deleteGear(this.selectedGear);
    },
  },
});
</script>

<style lang="scss">
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
