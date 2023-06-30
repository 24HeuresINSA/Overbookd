<template>
  <v-card class="pt-3">
    <v-img src="/img/log/plugs.png"></v-img>
    <v-card-title>Ajouter un besoin d'électricité</v-card-title>
    <v-card-text>
      <v-form>
        <v-select
          v-model="electricityType"
          type="select"
          label="Type de prise*"
          :items="electricityTypeLabels"
          item-value="type"
          item-text="label"
        ></v-select>

        <v-text-field v-model="device" label="Appareil*"></v-text-field>

        <v-text-field
          v-model="power"
          label="Puissance par appareil*"
          suffix="Watts"
          :rules="[rules.number, rules.min]"
        ></v-text-field>

        <v-text-field
          v-model="count"
          type="number"
          label="Nombre*"
          :rules="[rules.number, rules.min]"
        ></v-text-field>

        <v-text-field v-model="comment" label="Commentaire"></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="confirmElectricityNeed">
        {{ elecNeed ? "Modifier" : "Ajouter" }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {
  ElectricityType,
  ElectricityTypeLabel,
  ElectricityTypeWithLabel,
  FaElectricityNeed,
} from "~/utils/models/fa";
import { isNumber, min } from "~/utils/rules/inputRules";

export default Vue.extend({
  name: "ElecLogisticForm",
  props: {
    index: {
      type: Number,
      default: () => -1,
    },
  },
  data: () => ({
    electricityType: "",
    device: "",
    power: "",
    count: "",
    comment: "",
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    elecNeed(): FaElectricityNeed | undefined {
      if (this.index === -1) return undefined;
      return this.$accessor.FA.mFA?.faElectricityNeeds?.[this.index];
    },
    mElecNeed(): FaElectricityNeed {
      return {
        electricityType: this.electricityType as ElectricityType,
        device: this.device,
        power: +this.power,
        count: +this.count,
        comment: this.comment,
      };
    },
    electricityTypeLabels(): ElectricityTypeWithLabel[] {
      const elecTypeLabels: ElectricityTypeWithLabel[] = Object.keys(
        ElectricityTypeLabel
      ).map((type) => {
        return {
          type: type as ElectricityType,
          label:
            ElectricityTypeLabel[type as keyof typeof ElectricityTypeLabel],
        };
      });
      return elecTypeLabels;
    },
  },
  watch: {
    elecNeed() {
      this.updateLocalVariable();
    },
  },
  async mounted() {
    this.updateLocalVariable();
  },
  methods: {
    updateLocalVariable() {
      if (!this.elecNeed) return this.clearLocalVariable();
      this.electricityType = this.elecNeed.electricityType;
      this.device = this.elecNeed.device ?? "";
      this.power = this.elecNeed.power.toString() ?? "";
      this.count = (this.elecNeed.count ?? "").toString();
      this.comment = this.elecNeed.comment ?? "";
    },
    clearLocalVariable() {
      this.electricityType = "";
      this.device = "";
      this.power = "";
      this.count = "";
      this.comment = "";
    },
    formIsInvalid() {
      return (
        !this.electricityType || !this.device || !this.power || !this.count
      );
    },
    confirmElectricityNeed() {
      if (this.formIsInvalid()) {
        return this.$store.dispatch("notif/pushNotification", {
          type: "error",
          message: "❌ Les champs avec * sont obligatoires !",
        });
      }
      this.$emit("change", this.mElecNeed);
      this.$emit("close-dialog");
      this.clearLocalVariable();
    },
  },
});
</script>

<style scoped>
.v-card {
  display: flex;
  flex-direction: column;
}
</style>
