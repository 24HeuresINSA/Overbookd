<template>
  <div>
    <v-card class="form-card">
      <v-card-title>
        <span class="headline">Ajouter un créneau</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="mTimeWindow.start"
          label="Début"
          type="datetime-local"
          pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}T[0-9]{2}:[0-9]{2}"
          :rules="dateTimeValidationRules"
          required
        ></v-text-field>
        <v-text-field
          v-model="mTimeWindow.end"
          label="Fin"
          type="datetime"
          pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}T[0-9]{2}:[0-9]{2}"
          :rules="dateTimeValidationRules"
          required
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="confirmTimeWindow">
          {{ timeWindow ? "Modifier" : "Ajouter" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { FT } from "~/utils/models/ft";

interface BrakeDownDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export default Vue.extend({
  name: "TimeframeForm",
  model: {
    prop: "timeWindow",
    event: "change",
  },
  props: {
    timeWindow: {
      type: Object,
      default: () => null,
    },
  },
  data: () => ({
    mTimeWindow: {
      start: "",
      end: "",
    },

    menuDateStart: false,
    menuTimeStart: false,
    menuDateEnd: false,
    menuTimeEnd: false,
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    manifDate(): string {
      return this.$accessor.config.getConfig("event_date");
    },
    dateTimeValidationRules() {
      return [
        (v: any) =>
          /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/.test(v) ||
          "Entrez une date valide",
      ];
    },
  },
  methods: {
    allowedStep(m: number): boolean {
      return m % 15 === 0;
    },
    confirmTimeWindow() {
      this.$emit("change", this.mTimeWindow);
    },
  },
});
</script>

<style lang="scss" scoped>
.form-card {
  display: flex;
  flex-direction: column;

  .v-card-text {
    display: flex;
    margin: 0 24px;
  }
}
</style>
