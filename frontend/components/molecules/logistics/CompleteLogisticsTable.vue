<template>
  <v-data-table
    :headers="headers"
    :items="gearRequests"
    :hide-default-footer="true"
  >
    <template #[`item.name`]="{ item }">
      {{ item.gear.name }}
    </template>

    <template #[`item.drive`]="{ item }">
      {{ item.drive ?? "Non défini" }}
    </template>

    <template #no-data> Cette FA n'a pas de demande de matériel. </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { StoredGearRequest } from "~/utils/models/gearRequests";

export default Vue.extend({
  name: "CompleteLogisticsTable",
  data: () => ({
    headers: [
      { text: "Nom", value: "name" },
      { text: "Quantité", value: "quantity" },
      { text: "Lieu de retrait", value: "drive" },
    ],
  }),
  computed: {
    gearRequests(): StoredGearRequest<"FA">[] {
      return (this.$accessor.FT.mFT.faGearRequests ?? []).reduce(
        this.uniqueGearReducer,
        [] as StoredGearRequest<"FA">[]
      );
    },
  },
  methods: {
    uniqueGearReducer(
      gearRequests: StoredGearRequest<"FA">[],
      gearRequest: StoredGearRequest<"FA">
    ) {
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
