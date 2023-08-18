<template>
  <v-card>
    <v-card-title> Valider la partie matos </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="gearRequestsToApprove"
        dense
        :items-per-page="-1"
        :custom-sort="sortGearRequests"
      >
        <template #item.delete="{ item }">
          <v-icon small @click="removeGearRequest(item)"> mdi-delete </v-icon>
        </template>
        <template #item.gear="{ item }">
          {{ item.gear.name }}
        </template>
        <template #item.startDate="{ item }">
          {{ formatDate(item.rentalPeriod.start) }}
        </template>
        <template #item.endDate="{ item }">
          {{ formatDate(item.rentalPeriod.end) }}
        </template>
        <template #item.drive="{ item }">
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
import { gearRequestsSorts } from "~/utils/functions/gearRequest";
import { Header } from "~/utils/models/data-table.model";
import {
  GearRequest,
  GearRequestWithDrive,
  isFAStoredGearRequest,
  isFTStoredGearRequest,
  SortableGearRequestHeader,
  StoredGearRequest,
} from "~/utils/models/gear-request.model";

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
        { text: "Suppression", value: "delete", sortable: false },
        { text: "Quantite", value: "quantity" },
        { text: "Matos", value: "gear" },
        { text: "Du", value: "startDate" },
        { text: "Au", value: "endDate" },
        { text: "Magasin", value: "drive", width: "30%", sortable: false },
      ],

      drives: [
        "Benne Collette Besson",
        "Benne Parking K-fet",
        "Parking Eiffel",
        "Creux GCU",
        "Creux GM",
        "Cave E",
        "Club Rock",
        "Conteneur 24h",
        "Conteneur Karna",
        "Conteneur Parking K-fet",
        "Conteneur Scène Roots",
        "Hall des Humanités",
        "Local 24h",
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
    gearRequestsToApprove(): StoredGearRequest[] {
      const gearRequests: StoredGearRequest[] = this.isFA
        ? this.$accessor.fa.gearRequests
        : this.$accessor.ft.gearRequests;
      return gearRequests.filter(
        (gr) => gr.gear.owner?.code === this.validator.code,
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

    updateGearRequestWithDrive(gearRequest: StoredGearRequest, drive: string) {
      const payload = {
        ...gearRequest,
        drive,
      };
      if (isFAStoredGearRequest(payload)) {
        return this.$accessor.fa.setDriveToGearRequest(payload);
      }
      if (isFTStoredGearRequest(payload)) {
        return this.$accessor.ft.setDriveToGearRequest(payload);
      }
    },

    removeGearRequest(gearRequest: StoredGearRequest) {
      if (isFAStoredGearRequest(gearRequest)) {
        return this.$accessor.fa.removeGearRequest(gearRequest);
      }
      if (isFTStoredGearRequest(gearRequest)) {
        return this.$accessor.ft.removeGearRequest(gearRequest);
      }
    },

    async validateGearRequests() {
      const gearRequests = this.gearRequestsToApprove.filter(
        (gr): gr is GearRequestWithDrive<"FA" | "FT"> => Boolean(gr.drive),
      );
      const validation = this.isFA
        ? this.$accessor.fa.validateGearRequests(gearRequests)
        : this.$accessor.ft.validateGearRequests(gearRequests);
      await validation;
      this.$emit("close-dialog");
    },

    sortGearRequests(
      gearRequests: GearRequest[],
      sortsBy: SortableGearRequestHeader[],
      sortsDesc: boolean[],
    ): GearRequest[] {
      const sortBy = sortsBy.at(0) ?? "quantity";
      const sortFnc = gearRequestsSorts.get(sortBy);

      if (!sortFnc) return gearRequests;

      const sortDesc = sortsDesc.at(0) ?? false;
      return sortFnc(gearRequests, sortDesc);
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
