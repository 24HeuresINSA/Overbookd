<template>
  <div class="contractors__listing">
    <v-data-table
      :headers="headers"
      :items="contractors"
      item-key="key"
      :items-per-page="-1"
      disable-pagination
      hide-default-footer
    >
      <template #item.actions="{ item }">
        <div v-if="!disabled">
          <v-btn icon @click="openUpdateContractorDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="removeContractor(item)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </div>
      </template>
      <template #no-data> Aucun prestataire </template>
    </v-data-table>

    <v-btn
      color="primary"
      class="contractors__add"
      @click="openAddContractorDialog"
    >
      Ajouter un presta
    </v-btn>

    <v-dialog v-model="isContractorDialogOpen" max-width="600">
      <ContractorForm
        :contractor="selectedContractor"
        @add="addContractor"
        @update="updateContractor"
        @close-dialog="closeAddDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ContractorForm from "./ContractorForm.vue";
import {
  Contractor,
  PrepareContractorCreation,
} from "@overbookd/festival-event";
import { Header } from "~/utils/data-table/header";

type ContractorData = {
  headers: Header[];
  isContractorDialogOpen: boolean;
  selectedContractor: Contractor | null;
};

export default defineComponent({
  name: "ContractorTable",
  components: { ContractorForm },
  props: {
    contractors: {
      type: Array as () => Contractor[],
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: (): ContractorData => ({
    headers: [
      { text: "Prénom", value: "firstname", sortable: false },
      { text: "Nom", value: "lastname", sortable: false },
      { text: "Téléphone", value: "phone", sortable: false },
      { text: "Email", value: "email", sortable: false },
      { text: "Société", value: "company", sortable: false },
      { text: "Commentaire", value: "comment", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],

    isContractorDialogOpen: false,
    selectedContractor: null,
  }),
  methods: {
    addContractor(contractor: PrepareContractorCreation) {
      this.$emit("add", contractor);
    },
    updateContractor(contractor: Contractor) {
      this.$emit("update", contractor);
    },
    removeContractor(contractor: Contractor) {
      this.$emit("remove", contractor);
    },
    openAddContractorDialog() {
      this.selectedContractor = null;
      this.isContractorDialogOpen = true;
    },
    closeAddDialog() {
      this.isContractorDialogOpen = false;
      this.selectedContractor = null;
    },
    openUpdateContractorDialog(contractor: Contractor) {
      this.selectedContractor = contractor;
      this.isContractorDialogOpen = true;
    },
    closeUpdateDialog() {
      this.isContractorDialogOpen = false;
      this.selectedContractor = null;
    },
  },
});
</script>

<style lang="scss" scoped>
.contractors {
  &__listing {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
  &__add {
    max-width: fit-content;
    align-self: flex-end;
  }
}
</style>
