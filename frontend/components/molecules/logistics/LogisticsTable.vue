<template>
  <v-data-table :headers="headers" :items="gearRequest">
    <template #[`item.name`]="{ item }">
      {{ item.gear.name }}
    </template>

    <template #[`item.quantity`]="{ item }">
      {{ item.quantity }}
    </template>

    <template #[`item.action`]="{ item }">
      <v-btn v-if="!isDisabled" icon @click="deleteGear(item.gear)">
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { Gear } from "~/utils/models/catalog.model";
import { GearRequest } from "~/utils/models/FA";

export default Vue.extend({
  name: "LogisticsTable",
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
    owner: {
      type: String,
      default: () => "",
    },
  },
  data: () => ({
    headers: [
      { text: "Nom", value: "name" },
      { text: "Quantité", value: "quantity" },
      { text: "Action", value: "action" },
    ],
  }),
  computed: {
    gearRequest(): GearRequest[] {
      switch (this.owner) {
        case "matos":
          return this.$accessor.FA.matosGearRequests.reduce(
            this.uniqueGearReducer,
            [] as GearRequest[]
          );
        case "elec":
          return this.$accessor.FA.elecGearRequests.reduce(
            this.uniqueGearReducer,
            [] as GearRequest[]
          );
        case "barrieres":
          return this.$accessor.FA.barrieresGearRequests.reduce(
            this.uniqueGearReducer,
            [] as GearRequest[]
          );
        default:
          return [];
      }
    },
  },
  methods: {
    deleteGear(gear: Gear) {
      this.$accessor.FA.removeGearRequest(gear.id);
    },
    uniqueGearReducer(gearRequests: GearRequest[], gearRequest: GearRequest) {
      const existingGearRequest = gearRequests.find(
        (gr) => gr.gear.id === gearRequest.gear.id
      );
      if (existingGearRequest) return gearRequests;
      return [...gearRequests, gearRequest];
    },
  },
});
</script>

<style scoped>
.text-width {
  max-width: 200px;
}
</style>
