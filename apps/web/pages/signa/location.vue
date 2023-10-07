<template>
  <div>
    <h1>Lieux de la Signa</h1>
    <section class="location-table">
      <v-container class="filter"> </v-container>
      <v-container class="table">
        <v-data-table
          :headers="headers"
          :items="filteredLocations"
          :footer-props="{ 'items-per-page-options': [20, 100, -1] }"
          class="elevation-1"
        />
      </v-container>
    </section>

    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Header } from "~/utils/models/data-table.model";
import { WRITE_SIGNAGE_LOCATION } from "@overbookd/permission";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { SignaLocation } from "~/utils/models/signa-location.model";

interface LocationData {
  headers: Header[];
}

export default Vue.extend({
  name: "Location",
  components: {
    SnackNotificationContainer,
  },
  data: (): LocationData => ({
    headers: [
      { text: "Nom", value: "name" },
    ],
  }),
  head: () => ({
    title: "Lieux de la signa",
  }),
  computed: {
    isLocationWriter(): boolean {
      return this.$accessor.user.can(WRITE_SIGNAGE_LOCATION);
    },
    filteredLocations(): SignaLocation[] {
      return this.$accessor.signa.locations;
    },
  },
  async mounted() {
    this.$accessor.signa.getAllSignaLocations();
  },
});
</script>
