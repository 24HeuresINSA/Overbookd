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
import { formatDateWithMinutes } from "~/utils/date/dateUtils";
import { Header } from "~/utils/models/Data";
import {
  GearRequestWithDrive,
  isFAStoredGearRequest,
  isFTStoredGearRequest,
  StoredGearRequest,
} from "~/utils/models/gearRequests";

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
    festivalEvent: {
      type: String,
      default: () => "FA",
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
    isFA(): boolean {
      return this.festivalEvent === "FA";
    },
    gearRequestsToApprove(): StoredGearRequest<"FA" | "FT">[] {
      const gearRequests: StoredGearRequest<"FA" | "FT">[] = this.isFA
        ? this.$accessor.FA.gearRequests
        : this.$accessor.FT.gearRequests;
      return gearRequests.filter(
        (gr) => gr.gear.owner?.code === this.validator.code
      );
    },
    canValidateGearRequest(): boolean {
      return this.gearRequestsToApprove.every((gr) => gr.drive);
    },
  },

  methods: {
    formatDate(date: string): string {
      return formatDateWithMinutes(date);
    },

    updateGearRequestWithDrive(
      gearRequest: StoredGearRequest<"FA" | "FT">,
      drive: string
    ) {
      const payload = {
        ...gearRequest,
        drive,
      };
      if (isFAStoredGearRequest(payload)) {
        return this.$accessor.FA.setDriveToGearRequest(payload);
      }
      if (isFTStoredGearRequest(payload)) {
        return this.$accessor.FT.setDriveToGearRequest(payload);
      }
    },

    async validateGearRequests() {
      const gearRequests = this.gearRequestsToApprove.filter(
        (gr): gr is GearRequestWithDrive<"FA" | "FT"> => Boolean(gr.drive)
      );
      const validation = this.isFA
        ? this.$accessor.FA.validateGearRequests(gearRequests)
        : this.$accessor.FT.validateGearRequests(gearRequests);
      await validation;
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
