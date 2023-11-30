<template>
  <v-data-table
    :headers="headers"
    :items="supplies"
    item-key="key"
    :items-per-page="-1"
    disable-pagination
    hide-default-footer
    dense
  >
    <template #[`item.connection`]="{ item }">
      {{ getConnectionLabel(item.electricityType) }}
    </template>
    <template #item.power="{ item }"> {{ item.power }} W </template>
    <template #item.actions="{ item }">
      <div v-if="!disabled">
        <v-btn icon @click="updateSupply(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteSupply(item)">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </div>
    </template>
    <template #no-data> Aucun besoin d'électricité </template>
  </v-data-table>
</template>

import { electricityConnectionLabels } from
"~/utils/festival-event/festival-activity.model";
<script lang="ts">
import { defineComponent } from "vue";
import {
  ElectricitySupply,
  ElectricityConnection,
} from "@overbookd/festival-activity";
import { electricityConnectionLabels } from "~/utils/festival-event/festival-activity.model";

export default defineComponent({
  name: "ElectricitySupplyTable",
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
  data: () => ({
    headers: [
      { text: "Type de raccordement", value: "connection" },
      { text: "Appareil", value: "device" },
      { text: "Puissance par appareil", value: "power" },
      { text: "Nombre", value: "count" },
      { text: "Commentaire", value: "comment", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),
  methods: {
    getConnectionLabel(connection: ElectricityConnection): string {
      return electricityConnectionLabels.get(connection) ?? "";
    },
    updateSupply(supply: ElectricitySupply) {
      this.$emit("update", supply);
    },
    deleteSupply(supply: ElectricitySupply) {
      this.$emit("delete", supply);
    },
  },
});
</script>
