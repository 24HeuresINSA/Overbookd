<template>
  <div>
    <v-card :class="validationStatus">
      <v-card-title>Besoin d'électricité</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="electricityNeeds">
          <template #[`item.action`]="{ index }">
            <v-btn
              v-if="!isValidatedByOwner"
              icon
              @click="deleteElectricityNeed(index)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions v-if="!isValidatedByOwner">
        <v-spacer></v-spacer>
        <v-btn text @click="isElectricityNeedDialogOpen = true">Ajouter</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="isElectricityNeedDialogOpen" max-width="600">
      <v-card>
        <v-img src="/img/log/plugs.jpeg"></v-img>
        <v-card-title>Ajouter un besoin d'électricité</v-card-title>
        <v-card-text>
          <v-form>
            <v-select
              v-model="newElectricityNeed.electricity_type"
              type="select"
              label="Type de prise*"
              :items="electricityType"
              dense
            ></v-select>

            <v-text-field
              v-model="newElectricityNeed.power"
              type="number"
              label="Puissance (en Watt)*"
            ></v-text-field>

            <v-text-field
              v-model="newElectricityNeed.comment"
              label="Commentaire"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="addElectricityNeed">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  electricity_type,
  FA,
  fa_electricity_needs,
  Status,
} from "~/utils/models/FA";
import {
  isAnimationValidatedBy,
  getFAValidationStatus,
} from "~/utils/rules/faValidationRules";

const headers = [
  { text: "Type de raccordement", value: "electricity_type" },
  { text: "Puissance (en W)", value: "power" },
  { text: "Commentaire", value: "comment" },
  { text: "Action", value: "action" },
];

export default Vue.extend({
  name: "ElecLogisticCard",
  data: () => ({
    owner: "elec",
    headers,
    isElectricityNeedDialogOpen: false,
    newElectricityNeed: {
      electricity_type: "",
      power: "",
      comment: "",
    },
  }),
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    electricityNeeds(): any {
      return this.mFA.fa_electricity_needs;
    },
    electricityType(): Array<string> {
      return Object.values(electricity_type);
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): Status {
      return getFAValidationStatus(this.mFA, this.owner);
    },
  },
  methods: {
    addElectricityNeed() {
      if (!this.newElectricityNeed.electricity_type) {
        return this.$store.dispatch("notif/pushNotification", {
          type: "error",
          message: "❌ N'oublie pas de choisir le type de prise !",
        });
      }

      this.newElectricityNeed.power = this.newElectricityNeed.power.replace(
        ",",
        "."
      );
      if (+this.newElectricityNeed.power <= 0) {
        return this.$store.dispatch("notif/pushNotification", {
          type: "error",
          message: "❌ La puissance n'est pas valide...",
        });
      }

      const newElecNeed: fa_electricity_needs = {
        fa_id: +this.$route.params.fa,
        electricity_type: this.newElectricityNeed
          .electricity_type as electricity_type,
        power: +this.newElectricityNeed.power,
        comment: this.newElectricityNeed.comment,
      };

      this.$accessor.FA.addElectricityNeed(newElecNeed);
      this.isElectricityNeedDialogOpen = false;
      this.newElectricityNeed = {
        electricity_type: "",
        power: "",
        comment: "",
      };
    },

    async deleteElectricityNeed(index: number) {
      await this.$accessor.FA.deleteElectricityNeed(index);
    },
  },
});
</script>
