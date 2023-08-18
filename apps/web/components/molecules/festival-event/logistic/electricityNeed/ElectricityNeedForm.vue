<template>
  <v-card class="form-card">
    <v-img src="/img/log/plugs.png"></v-img>
    <v-card-title>
      <span class="headline">
        {{ statusFormLabel }} un besoin d'électricité
      </span>
    </v-card-title>

    <v-card-text>
      <v-select
        v-model="electricityType"
        type="select"
        label="Type de prise*"
        :items="electricityTypeLabelList"
        item-value="type"
        item-text="label"
      ></v-select>

      <v-text-field v-model="device" label="Appareil*"></v-text-field>

      <v-text-field
        v-model="power"
        label="Puissance par appareil*"
        type="number"
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
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="confirmElectricityNeed">
        {{ statusFormLabel }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {
  ElectricityType,
  ElectricityTypeWithLabel,
  electricityTypeLabels,
} from "~/utils/models/fa.model";
import { isNumber, min } from "~/utils/rules/inputRules";

interface ElectricityNeedData {
  electricityType?: ElectricityType;
  device?: string;
  power?: string;
  count?: string;
  comment?: string;
  rules: {
    number: (v: string) => boolean | string;
    min: (v: string) => boolean | string;
  };
}

export default Vue.extend({
  name: "ElectricityNeedForm",
  model: {
    prop: "electricityNeed",
    event: "change",
  },
  props: {
    electricityNeed: {
      type: Object,
      default: () => null,
    },
  },
  data: (): ElectricityNeedData => ({
    electricityType: undefined,
    device: undefined,
    power: undefined,
    count: undefined,
    comment: undefined,
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    electricityTypeLabelList(): ElectricityTypeWithLabel[] {
      return [...electricityTypeLabels.entries()].map(([type, label]) => ({
        type,
        label,
      }));
    },
    isFormInvalid(): boolean {
      const isElectricityTypeInvalid = this.electricityType === undefined;
      const isDeviceInvalid = this.device === undefined || !this.device.trim();
      const isPowerInvalid = this.power === undefined || +this.power < 1;
      const isCountInvalid = this.count === undefined || +this.count < 1;

      return (
        isElectricityTypeInvalid ||
        isDeviceInvalid ||
        isPowerInvalid ||
        isCountInvalid
      );
    },
    statusFormLabel(): string {
      return this.electricityNeed !== null ? "Modifier" : "Ajouter";
    },
  },
  watch: {
    electricityNeed() {
      this.updateLocalVariable();
    },
  },
  async mounted() {
    this.updateLocalVariable();
  },
  methods: {
    updateLocalVariable() {
      if (!this.electricityNeed) return this.clearLocalVariable();
      this.electricityType = this.electricityNeed?.electricityType;
      this.device = this.electricityNeed?.device;
      this.power = this.electricityNeed?.power;
      this.count = this.electricityNeed?.count;
      this.comment = this.electricityNeed?.comment;
    },
    clearLocalVariable() {
      this.electricityType = undefined;
      this.device = undefined;
      this.power = undefined;
      this.count = undefined;
      this.comment = undefined;
    },
    confirmElectricityNeed() {
      if (this.isFormInvalid) {
        return this.$accessor.notif.pushNotification({
          message: "❌ Tu dois compléter tous les champs avec une * !",
        });
      }

      const electricityNeed = {
        id: this.electricityNeed?.id,
        electricityType: this.electricityType,
        device: this.device,
        power: this.power ? +this.power : undefined,
        count: this.count ? +this.count : undefined,
        comment: this.comment,
      };

      this.$emit("change", electricityNeed);
      this.$emit("close-dialog");
      this.clearLocalVariable();
    },
    showErrorMessage(message: string) {
      return this.$accessor.notif.pushNotification({ message });
    },
  },
});
</script>

<style lang="scss" scoped>
.form-card {
  display: flex;
  flex-direction: column;
}
</style>
