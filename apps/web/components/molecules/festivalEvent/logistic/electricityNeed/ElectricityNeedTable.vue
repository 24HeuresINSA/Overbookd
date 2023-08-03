<template>
  <v-data-table
    :headers="headers"
    :items="electricityNeeds"
    dense
    item-key="key"
    :items-per-page="-1"
  >
    <template #[`item.electricityType`]="{ item }">
      {{ getElectricityTypeLabel(item.electricityType) }}
    </template>
    <template #[`item.power`]="{ item }"> {{ item.power }} W </template>
    <template #item.action="{ item }">
      <div v-if="!disabled">
        <v-btn icon @click="updateElectricityNeed(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteElectricityNeed(item)">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </div>
    </template>
    <template #no-data> Aucun besoin d'électricité ajouté </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import {
  ElectricityType,
  Fa,
  FaElectricityNeed,
  electricityTypeLabels,
} from "~/utils/models/fa";

export default Vue.extend({
  name: "ElectricityNeedTable",
  props: {
    electricityNeeds: {
      type: Array as () => FaElectricityNeed[],
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    headers: [
      {
        text: "Type de raccordement",
        value: "electricityType",
        sortable: false,
      },
      { text: "Appareil", value: "device", sortable: false },
      { text: "Puissance par appareil", value: "power", sortable: false },
      { text: "Nombre", value: "count", sortable: false },
      { text: "Commentaire", value: "comment", sortable: false },
      { text: "Action", value: "action", sortable: false },
    ],
  }),
  computed: {
    mFA(): Fa {
      return this.$accessor.fa.mFA;
    },
  },
  methods: {
    getElectricityTypeLabel(type: ElectricityType): string {
      return electricityTypeLabels[type as ElectricityType];
    },
    updateElectricityNeed(electricityNeed: FaElectricityNeed) {
      this.$emit("update", electricityNeed);
    },
    deleteElectricityNeed(electricityNeed: FaElectricityNeed) {
      this.$emit("delete", electricityNeed);
    },
  },
});
</script>
