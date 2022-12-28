<template>
  <div>
    <v-card :class="isDisabled ? 'disabled' : ''">
      <v-card-title>Besoin d'électricité</v-card-title>
      <v-card-subtitle
        >Si ton animation a besoin d'électricité, il faut renseigner les
        informations demandées pour chaque besoin. Pour plus de renseignement,
        vois avec la Log Elec via logistique@24heures.org</v-card-subtitle
      >
      <v-card-text>
        <v-data-table :headers="headers" :items="electricityNeeds">
          <template #[`item.count`]="{ index, item }">
            <v-text-field
              :value="item.count ? item.count : '1'"
              label="Nombre"
              type="number"
              :rules="[rules.number, rules.min]"
              :disabled="isDisabled"
              @change="updateElectricityNeedCount(index, $event)"
            ></v-text-field>
          </template>
          <template #[`item.action`]="{ index }">
            <v-btn
              v-if="!isDisabled"
              icon
              @click="deleteElectricityNeed(index)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions v-if="!isDisabled">
        <v-spacer></v-spacer>
        <v-btn text @click="isElectricityNeedDialogOpen = true"
          >Ajouter un besoin</v-btn
        >
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
              required
            ></v-select>

            <v-text-field
              v-model="newElectricityNeed.gear"
              label="Appareil*"
              required
            ></v-text-field>

            <v-text-field
              v-model="newElectricityNeed.power"
              type="number"
              label="Puissance/appareil*"
              :rules="[rules.number, rules.min]"
              required
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
import { electricity_type, fa_electricity_needs } from "~/utils/models/FA";
import { isNumber, min } from "~/utils/rules/inputRules";

const headers = [
  { text: "Type de raccordement", value: "electricity_type" },
  { text: "Appareil", value: "gear" },
  { text: "Puissance/appareil", value: "power" },
  { text: "Nombre", value: "count" },
  { text: "Commentaire", value: "comment" },
  { text: "Action", value: "action" },
];

export default Vue.extend({
  name: "ElecLogisticCard",
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    headers,
    isElectricityNeedDialogOpen: false,
    newElectricityNeed: {
      electricity_type: "",
      gear: "",
      power: "",
      comment: "",
    },
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    electricityNeeds(): any {
      return this.$accessor.FA.mFA.fa_electricity_needs;
    },
    electricityType(): Array<string> {
      return Object.values(electricity_type);
    },
  },
  methods: {
    addElectricityNeed() {
      const { comment, ...rest } = this.newElectricityNeed;
      const isFormValid = Object.values(rest).every((value) => value !== "");
      if (!isFormValid) {
        return this.$store.dispatch("notif/pushNotification", {
          type: "error",
          message: "❌ Les champs avec * sont obligatoires !",
        });
      }

      this.newElectricityNeed.power = this.newElectricityNeed.power.replace(
        ",",
        "."
      );

      const newElecNeed: fa_electricity_needs = {
        fa_id: +this.$route.params.fa,
        electricity_type: this.newElectricityNeed
          .electricity_type as electricity_type,
        gear: this.newElectricityNeed.gear,
        power: +this.newElectricityNeed.power,
        count: 1,
        comment: this.newElectricityNeed.comment,
      };

      this.$accessor.FA.addElectricityNeed(newElecNeed);
      this.isElectricityNeedDialogOpen = false;
      this.newElectricityNeed = {
        electricity_type: "",
        gear: "",
        power: "",
        comment: "",
      };
    },

    updateElectricityNeedCount(index: number, count: number) {
      this.$accessor.FA.updateSignaNeedCount({ index, count });
    },

    async deleteElectricityNeed(index: number) {
      await this.$accessor.FA.deleteElectricityNeed(index);
    },
  },
});
</script>
