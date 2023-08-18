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
import { Header } from "~/utils/models/data-table.model";
import { GearRequest } from "~/utils/models/gear-request.model";

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
    gearRequests(): GearRequest<"FT">[] {
      return this.$accessor.ft.gearRequests.reduce<GearRequest<"FT">[]>(
        (
          gearRequests: GearRequest<"FT">[],
          gearRequest: GearRequest<"FT">,
        ): GearRequest<"FT">[] => uniqueGearReducer(gearRequests, gearRequest),
        [],
      );
    },
  },
  methods: {
    deleteGear(gear: Gear) {
      this.$accessor.ft.removeRelatedGearRequest(gear.id);
    },
  },
});
</script>

<style scoped>
.text-width {
  max-width: 200px;
}
</style>
