<template>
  <div>
    <h2>Signalisations</h2>
    <form class="filter">
      <v-text-field
        v-model="searchName"
        append-icon="mdi-hammer-screwdriver"
        label="Nom de la signalisation"
        autofocus
        clearable
        clear-icon="mdi-close-circle-outline"
        counter
      ></v-text-field>

      <v-select
        v-model="searchType"
        type="select"
        label="Type de signalisation"
        :items="signageTypes"
        clearable
      ></v-select>
    </form>
    <v-data-table :headers="headers" :items="signages" :loading="loading">
      <template v-if="isCatalogWriter" #item.actions="{ item }">
        <v-icon small class="mr-2" @click="openUpdateSignageDialog(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="openDeleteSignageDialog(item)">
          mdi-delete
        </v-icon>
      </template>

      <template #no-data> Aucune signalisation trouvée </template>
    </v-data-table>

    <v-dialog v-model="isUpdateSignageDialogOpen" width="600px">
      <!---->
    </v-dialog>

    <v-dialog v-model="isDeleteSignageDialogOpen" width="600px">
      <ConfirmationMessage
        confirm-color="error"
        @close-dialog="closeDeleteSignageDialog"
        @confirm="deleteSignage"
      >
        <template #title>Suppression de la signalisation</template>
        <template #statement>
          Vous êtes sur le point de supprimer
          <strong>{{ selectedSignage?.name }}</strong>
        </template>
        <template #confirm-btn-content>
          <v-icon left> mdi-delete </v-icon>Supprimer
        </template>
      </ConfirmationMessage>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Header } from "~/utils/models/data-table.model";
import ConfirmationMessage from "../../atoms/card/ConfirmationMessage.vue";
import { Signage, SignageType, signageTypes } from "@overbookd/signa";
import { SlugifyService } from "@overbookd/slugify";

interface SignageListingData {
  headers: Header[];
  searchName: string;
  searchType?: SignageType;
  selectedSignage?: Signage;
  isUpdateSignageDialogOpen: boolean;
  isDeleteSignageDialogOpen: boolean;
}

export default Vue.extend({
  name: "SignageListing",
  components: { ConfirmationMessage },
  data(): SignageListingData {
    return {
      headers: [
        { text: "Nom", value: "name" },
        { text: "Type", value: "type" },
        { text: "Image", value: "image", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      searchName: "",
      searchType: undefined,

      selectedSignage: undefined,
      isUpdateSignageDialogOpen: false,
      isDeleteSignageDialogOpen: false,
    };
  },
  computed: {
    signages(): Signage[] {
      return this.$accessor.catalogSignage.signages;
    },
    filteredSignages(): Signage[] {
      return this.signages.filter((signage) => {
        return (
          this.filterSignagesByName(this.searchName)(signage) &&
          this.filterSignagesByType(this.searchType)(signage)
        );
      );
    },
    isCatalogWriter(): boolean {
      return this.$accessor.user.can("write-catalog-signa");
    },
    signageTypes(): SignageType[] {
      return Object.values(signageTypes);
    },
  },
  beforeMount() {
    this.fetchSignages();
  },
  methods: {
    async fetchSignages() {
      await this.$accessor.catalogSignage.fetchSignages();
    },
    openUpdateSignageDialog(signage: Signage) {
      this.selectedSignage = signage;
      this.isUpdateSignageDialogOpen = true;
    },
    openDeleteSignageDialog(signage: Signage) {
      this.selectedSignage = signage;
      this.isDeleteSignageDialogOpen = true;
    },
    closeUpdateSignageDialog() {
      this.isUpdateSignageDialogOpen = false;
    },
    closeDeleteSignageDialog() {
      this.isDeleteSignageDialogOpen = false;
    },
    async deleteSignage() {
      if (!this.selectedSignage) return;
      await this.$accessor.catalogSignage.deleteSignage(this.selectedSignage);
    },
    filterSignagesByName(search: string): (signage: Signage) => boolean {
      const slugifiedSearch = SlugifyService.apply(search);
      return ({ slug }) => slug.includes(slugifiedSearch);
    },
    filterSignagesByType(searchType?: SignageType): (signage: Signage) => boolean {
      return ({ type }) => type ? type === searchType : true;
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
