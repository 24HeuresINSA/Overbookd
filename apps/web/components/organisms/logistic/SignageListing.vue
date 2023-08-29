<template>
  <div>
    <h2>Signalisations</h2>
    <form class="filter">
      <v-text-field
        v-model="name"
        append-icon="mdi-hammer-screwdriver"
        label="Nom de la signalisation"
        autofocus
        clearable
        clear-icon="mdi-close-circle-outline"
        :disabled="loading"
        counter
        @input="defectSearchSignages"
        @keydown="searchOnEnter"
      ></v-text-field>
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
import { Signage, SignageSearchOptions, SignageType } from "@overbookd/signa";

interface SignageListingData {
  headers: Header[];
  name: string;
  type?: SignageType;
  loading: boolean;
  selectedSignage?: Signage;
  isUpdateSignageDialogOpen: boolean;
  isDeleteSignageDialogOpen: boolean;
  delay?: ReturnType<typeof setTimeout>;
}

export default Vue.extend({
  name: "SignageListing",
  components: { ConfirmationMessage },
  data(): SignageListingData {
    return {
      headers: [
        { text: "Signalisation", value: "name" },
        { text: "Type", value: "type" },
        { text: "Image", value: "image" },
        { text: "Actions", value: "actions" },
      ],
      name: "",
      type: undefined,
      loading: false,
      selectedSignage: undefined,
      isUpdateSignageDialogOpen: false,
      isDeleteSignageDialogOpen: false,
      delay: undefined,
    };
  },
  computed: {
    signages(): Signage[] {
      return this.$accessor.catalogSignage.signages;
    },
    isCatalogWriter(): boolean {
      return this.$accessor.user.can("write-catalog-signa");
    },
  },
  beforeMount() {
    this.fetchSignages({});
  },
  methods: {
    async searchSignages() {
      const searchOptions = this.buildSearchOptions();
      await this.fetchSignages(searchOptions);
    },
    searchOnEnter(keyEvent: KeyboardEvent) {
      if (keyEvent.key !== "Enter") return;
      return this.searchSignages();
    },
    async fetchSignages(searchOptions: SignageSearchOptions) {
      this.loading = true;
      await this.$accessor.catalogSignage.fetchSignages(searchOptions);
      this.loading = false;
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
    buildSearchOptions(): SignageSearchOptions {
      return {
        name: this.name ? this.name : undefined,
        type: this.type ? this.type : undefined,
      };
    },
    async deleteSignage() {
      if (!this.selectedSignage) return;
      await this.$accessor.catalogSignage.deleteSignage(this.selectedSignage);
    },
    defectSearchSignages() {
      if (this.delay) clearInterval(this.delay);
      this.delay = setTimeout(this.searchSignages, 800);
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
