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
      <v-btn
        color="green"
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
        "Parking Eiffel",
        "Parking K-fet",
        "Parking Collete Besson",
        "Parking BMC",
        "ARGIL",
        "AS Lyon 1",
        "Bar AIP",
        "BDE",
        "Catering",
        "Cave E",
        "Chalet Backline",
        "Club rock",
        "Conteneur",
        "Conteneur Karna",
        "Creux GCU",
        "Depart FIMI",
        "Depart GI",
        "Départ TC",
        "Direction INSA",
        "DOC INSA",
        "DPI",
        "Entrées",
        "Espace restauration",
        "Gedimat",
        "Graine d'Image",
        "Hall Humas",
        "KARNA",
        "Local",
        "Loges Artistes",
        "Magasin",
        "MdE",
        "Non-Stocké",
        "OSV",
        "Parking Eiffel",
        "Parking Scene Roots",
        "QG du blé",
        "QG orga",
        "Salle Montréal",
        "Salle rené char",
        "Transité par une com",
        "VC",
        "Villeurbanne",
        "Trou GM",
        "KLS",
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
      const displayOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Intl.DateTimeFormat("fr", displayOptions).format(
        new Date(date)
      );
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
