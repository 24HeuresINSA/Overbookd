<template>
  <div class="signages__listing">
    <v-data-table
      :headers="headers"
      :items="signages"
      item-key="key"
      :items-per-page="-1"
      disable-pagination
      hide-default-footer
    >
      <template #item.actions="{ item }">
        <div v-if="!disabled">
          <v-btn icon @click="openUpdateSignageDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="removeSignage(item)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </div>
      </template>
      <template #no-data> Aucune demande de signalétique </template>
    </v-data-table>

    <v-btn color="primary" class="signages__add" @click="openAddSignageDialog">
      Ajouter une signalétique
    </v-btn>

    <v-dialog v-model="isSignageDialogOpen" max-width="600">
      <FaSignageForm
        :signage="selectedSignage"
        @add="addSignage"
        @update="updateSignage"
        @close-dialog="closeAddDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FaSignageForm from "./FaSignageForm.vue";
import { Signage } from "@overbookd/festival-activity";
import { Header } from "~/utils/models/data-table.model";

type FaSignageTableData = {
  headers: Header[];
  isSignageDialogOpen: boolean;
  selectedSignage: Signage | null;
};

export default defineComponent({
  name: "FaSignageTable",
  components: { FaSignageForm },
  props: {
    signages: {
      type: Array as () => Signage[],
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: (): FaSignageTableData => ({
    headers: [
      { text: "Quantité", value: "quantity" },
      { text: "Type", value: "type" },
      { text: "Texte à écrire", value: "text", sortable: false },
      { text: "Taille", value: "size", sortable: false },
      { text: "Commentaire", value: "comment", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],

    isSignageDialogOpen: false,
    selectedSignage: null,
  }),
  methods: {
    addSignage(signage: Signage) {
      this.$emit("add", signage);
    },
    updateSignage(signage: Signage) {
      this.$emit("update", signage);
    },
    removeSignage(signage: Signage) {
      this.$emit("remove", signage);
    },
    openAddSignageDialog() {
      this.selectedSignage = null;
      this.isSignageDialogOpen = true;
    },
    closeAddDialog() {
      this.isSignageDialogOpen = false;
      this.selectedSignage = null;
    },
    openUpdateSignageDialog(signage: Signage) {
      this.selectedSignage = signage;
      this.isSignageDialogOpen = true;
    },
    closeUpdateDialog() {
      this.isSignageDialogOpen = false;
      this.selectedSignage = null;
    },
  },
});
</script>

<style lang="scss" scoped>
.signages {
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
