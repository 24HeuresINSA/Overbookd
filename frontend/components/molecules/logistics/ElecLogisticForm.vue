<template>
  <v-card class="pt-3">
    <v-img src="/img/log/plugs.png"></v-img>
    <v-card-title>Ajouter un besoin d'électricité</v-card-title>
    <v-card-text>
      <v-form>
        <v-select
          v-model="electricity_type"
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
  electricity_type,
  electricity_type_label,
  fa_electricity_needs,
} from "~/utils/models/FA";
import { isNumber, min } from "~/utils/rules/inputRules";

interface TypeLabel {
  type: electricity_type;
  label: electricity_type_label;
}

export default Vue.extend({
  name: "ElecLogisticForm",
  props: {
    index: {
      type: Number,
      default: () => -1,
    },
  },
  data: () => ({
    electricity_type: "",
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
    elecNeed(): fa_electricity_needs | undefined {
      if (this.index === -1) return undefined;
      return this.$accessor.FA.mFA?.fa_electricity_needs?.[this.index];
    },
    mElecNeed(): fa_electricity_needs {
      return {
        electricity_type: this.electricity_type as electricity_type,
        device: this.device,
        power: +this.power,
        count: +this.count,
        comment: this.comment,
      };
    },
    electricityTypeLabels(): TypeLabel[] {
      const elecTypeLabels: TypeLabel[] = Object.keys(
        electricity_type_label
      ).map((type) => {
        return {
          type: type as electricity_type,
          label:
            electricity_type_label[type as keyof typeof electricity_type_label],
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
      this.electricity_type = this.elecNeed.electricity_type;
      this.device = this.elecNeed.device ?? "";
      this.power = this.elecNeed.power.toString() ?? "";
      this.count = (this.elecNeed.count ?? "").toString();
      this.comment = this.elecNeed.comment ?? "";
    },
    clearLocalVariable() {
      this.electricity_type = "";
      this.device = "";
      this.power = "";
      this.count = "";
      this.comment = "";
    },
    formIsInvalid() {
      return (
        !this.electricity_type || !this.device || !this.power || !this.count
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
