<template>
  <v-card>
    <v-card-title> Valider la partie matos </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="gearRequestsToApprove"
        dense
        :items-per-page="-1"
      >
        <template #[`item.gear`]="{ item }">
          {{ item.gear.name }}
        </template>
        <template #[`item.startDate`]="{ item }">
          {{ formatDate(item.rentalPeriod.start) }}
        </template>
        <template #[`item.endDate`]="{ item }">
          {{ formatDate(item.rentalPeriod.end) }}
        </template>
        <template #[`item.drive`]="{ item }">
          <v-autocomplete
            class="drive"
            :value="item.drive"
            :items="drives"
            solo
            chips
            hide-details
            label="Selectionner un magasin"
            @change="updateGearRequestWithDrive(item, $event)"
          ></v-autocomplete>
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="green"
        class="white--text px-4"
        :disabled="!canValidateGearRequest"
        @click="validateGearRequests"
      >
        Valider
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { formatStringDateToDisplay } from "~/utils/date/dateUtils";
import { Header } from "~/utils/models/Data";
import { GearRequestWithDrive, StoredGearRequest } from "~/utils/models/FA";

interface GearRequestsValidationData {
  headers: Header[];
  drives: string[];
}

export default Vue.extend({
  name: "GearRequestsValidation",

  props: {
    validator: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  data(): GearRequestsValidationData {
    return {
      headers: [
        { text: "Quantite", value: "quantity" },
        { text: "Matos", value: "gear" },
        { text: "Du", value: "startDate" },
        { text: "Au", value: "endDate" },
        { text: "Magasin", value: "drive", width: "30%" },
      ],

      drives: [
        "Benne Collette Besson",
        "Benne Parking K-fet",
        "Parking Eiffel",
        "Creux GCU",
        "Cave E",
        "Club Rock",
        "Conteneur 24h",
        "Conteneur Karna",
        "Conteneur Parking K-fet",
        "Conteneur Scène Roots",
        "Hall des Humanités",
        "Magasin",
        "MdE",
        "Salle Montréal",
        "Salle René Char",
        "Non stocké",
        "QG Orga",
        "Backline",
        "Livré par l'équipe logistique",
        "Livré par une com",
      ],
    };
  },

  computed: {
    gearRequestsToApprove(): StoredGearRequest[] {
      return this.$accessor.FA.gearRequests.filter(
        (gr) => gr.gear.owner?.code === this.validator.code
      );
    },

    canValidateGearRequest(): boolean {
      return this.gearRequestsToApprove.every((gr) => gr.drive);
    },
  },

  methods: {
    formatDate(date: string): string {
      return formatStringDateToDisplay(date);
    },

    updateGearRequestWithDrive(gearRequest: StoredGearRequest, drive: string) {
      this.$accessor.FA.setDriveToGearRequest({ ...gearRequest, drive });
    },

    async validateGearRequests() {
      const gearRequests = this.gearRequestsToApprove.filter(
        (gr): gr is GearRequestWithDrive => Boolean(gr.drive)
      );
      await this.$accessor.FA.validateGearRequests(gearRequests);
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss" scoped>
.drive {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
