<template>
  <div class="supplies__listing">
    <v-data-table
      :headers="headers"
      :items="supplies"
      item-key="key"
      :items-per-page="-1"
      disable-pagination
      hide-default-footer
    >
      <template #item.connection="{ item }">
        {{ getConnectionLabel(item.connection) }}
      </template>
      <template #item.power="{ item }"> {{ item.power }} W </template>
      <template #item.actions="{ item }">
        <div v-if="!disabled">
          <v-btn icon @click="openUpdateSupplyDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="removeSupply(item)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </div>
      </template>
      <template #no-data> Aucun besoin en électricité </template>
    </v-data-table>

    <v-btn color="primary" class="supplies__add" @click="openAddSupplyDialog">
      Ajouter un besoin en électricité
    </v-btn>

    <v-dialog v-model="isSupplyDialogOpen" max-width="600">
      <ElectricitySupplyForm
        :supply="selectedSupply"
        @add="addSupply"
        @update="updateSupply"
        @close-dialog="closeAddDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ElectricitySupplyForm from "./ElectricitySupplyForm.vue";
import {
  ElectricitySupply,
  ElectricityConnection,
  PrepareElectricitySupplyCreation,
} from "@overbookd/festival-activity";
import { electricityConnectionLabels } from "~/utils/festival-event/festival-activity.model";
import { Header } from "~/utils/models/data-table.model";

type ElectricitySupplyTableData = {
  headers: Header[];
  isSupplyDialogOpen: boolean;
  selectedSupply: ElectricitySupply | null;
};

export default defineComponent({
  name: "ElectricitySupplyTable",
  components: { ElectricitySupplyForm },
  props: {
    supplies: {
      type: Array as () => ElectricitySupply[],
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: (): ElectricitySupplyTableData => ({
    headers: [
      { text: "Type de raccordement", value: "connection" },
      { text: "Appareil", value: "device" },
      { text: "Puissance par appareil", value: "power" },
      { text: "Nombre", value: "count" },
      { text: "Commentaire", value: "comment", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    isSupplyDialogOpen: false,
    selectedSupply: null,
  }),
  methods: {
    getConnectionLabel(connection: ElectricityConnection): string {
      return electricityConnectionLabels.get(connection) ?? "";
    },
    addSupply(supply: PrepareElectricitySupplyCreation) {
      this.$emit("add", supply);
    },
    updateSupply(supply: ElectricitySupply) {
      this.$emit("update", supply);
    },
    removeSupply(supply: ElectricitySupply) {
      this.$emit("remove", supply);
    },
    openAddSupplyDialog() {
      this.selectedSupply = null;
      this.isSupplyDialogOpen = true;
    },
    closeAddDialog() {
      this.isSupplyDialogOpen = false;
      this.selectedSupply = null;
    },
    openUpdateSupplyDialog(supply: ElectricitySupply) {
      this.selectedSupply = supply;
      this.isSupplyDialogOpen = true;
    },
    closeUpdateDialog() {
      this.isSupplyDialogOpen = false;
      this.selectedSupply = null;
    },
  },
});
</script>

<style lang="scss" scoped>
.supplies {
  &__listing {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin-bottom: 20px;
  }
  &__add {
    max-width: fit-content;
    align-self: flex-end;
  }
}
</style>
