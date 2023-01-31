<template>
  <v-data-table :headers="headers" :items="gearRequest">
    <template #item.name="{ item }">
      {{ item.gear.name }}
    </template>

    <template #item.quantity="{ item }">
      {{ item.quantity }}
    </template>

    <template #item.drive="{ item }">
      {{ item.drive ?? "Non défini" }}
    </template>

    <template #item.action="{ item }">
      <v-btn v-if="!isDisabled" icon @click="deleteGear(item.gear)">
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { uniqueGearReducer } from "~/utils/functions/gearRequest";
import { Gear } from "~/utils/models/catalog.model";
import { Header } from "~/utils/models/Data";
import { GearRequest } from "~/utils/models/gearRequests";

export default Vue.extend({
  name: "FTLogisticsTable",
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    headers(): Header[] {
      const actionHeader = { text: "Action", value: "action" };
      const driveHeader = { text: "Lieu de retrait", value: "drive" };
      const commonHeaders = [
        { text: "Nom", value: "name" },
        { text: "Quantité", value: "quantity" },
      ];
      return this.isDisabled
        ? [...commonHeaders, driveHeader]
        : [...commonHeaders, actionHeader];
    },
    gearRequest(): GearRequest<"FT">[] {
      return this.$accessor.FT.gearRequests.reduce(
        uniqueGearReducer<"FT">,
        [] as GearRequest<"FT">[]
      );
    },
  },
  methods: {
    deleteGear(gear: Gear) {
      this.$accessor.FT.removeGearRequest(gear.id);
    },
  },
});
</script>

<style scoped>
.text-width {
  max-width: 200px;
}
</style>
