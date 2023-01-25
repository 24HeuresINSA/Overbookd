<template>
  <div class="gear-request-listing">
    <v-card>
      <v-card-title>Demandes de matos</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="gearRequests">
          <template #item.gear="{ item }">
            {{ item.gear.name }}
          </template>
          <template #item.from="{ item }">
            <nuxt-link :to="seekerLink(item.seeker)">
              {{ displaySeeker(item.seeker) }}
            </nuxt-link>
          </template>
          <template #item.start="{ item }">
            {{ displayDate(item.rentalPeriod.start) }}
          </template>
          <template #item.end="{ item }">
            {{ displayDate(item.rentalPeriod.end) }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateWithMinutes } from "~/utils/date/dateUtils";
import { Header } from "~/utils/models/Data";
import { EventGearRequest, EventSeeker } from "~/utils/models/gearRequests";

interface GearRequestListingData {
  headers: Header[];
}

export default Vue.extend({
  name: "GearRequestListing",
  data(): GearRequestListingData {
    return {
      headers: [
        { text: "Matos", value: "gear" },
        { text: "Quantite", value: "quantity" },
        { text: "Par", value: "from" },
        { text: "De", value: "start" },
        { text: "A", value: "end" },
        { text: "Retrait", value: "drive" },
      ],
    };
  },
  computed: {
    gearRequests(): EventGearRequest[] {
      return this.$accessor.gearRequest.gearRequests;
    },
  },
  mounted() {
    if (this.gearRequests.length) return;
    this.$accessor.gearRequest.fetchGearRequests();
  },
  methods: {
    displaySeeker({ type, id, name }: EventSeeker): string {
      return `${type} #${id} - ${name}`;
    },
    seekerLink({ type, id }: EventSeeker): string {
      return `${type.toLowerCase()}/${id}`;
    },
    displayDate(date: Date): string {
      return formatDateWithMinutes(date);
    },
  },
});
</script>
