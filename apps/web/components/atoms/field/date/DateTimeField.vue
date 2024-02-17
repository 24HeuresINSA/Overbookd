<template>
  <v-text-field
    v-model="dateStringified"
    :label="label"
    type="datetime-local"
    :step="fieldStep"
    :solo="boxed"
    :filled="boxed"
    :outilned="!boxed"
    :hide-details="hideDetails"
    :error-messages="errorMessages"
    return-object
    @change="updateDate"
    @keydown.enter="enterKeyDown"
  >
  </v-text-field>
</template>

<script lang="ts">
import { ONE_MINUTE_IN_MS, ONE_SECOND_IN_MS } from "@overbookd/period";
import Vue from "vue";
import { formatLocalDateTime, roundMinutes } from "~/utils/date/date.utils";

const ONE_MINUTE_IN_SECONDS = ONE_MINUTE_IN_MS / ONE_SECOND_IN_MS;

export default Vue.extend({
  name: "DateTimeField",
  model: {
    prop: "date",
    event: "change",
  },
  props: {
    label: {
      type: String,
      default: "Date",
    },
    date: {
      type: Date,
      default: () => undefined as Date | undefined,
    },
    boxed: {
      type: Boolean,
      default: true,
    },
    step: {
      type: Number,
      default: 15,
    },
    errorMessages: {
      type: Array as () => string[],
      default: () => [],
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    dateStringified: "",
  }),
  computed: {
    fieldStep(): number {
      return this.step * ONE_MINUTE_IN_SECONDS;
    },
  },
  watch: {
    date() {
      this.dateStringified = this.stringifyDate(this.date);
    },
  },
  mounted() {
    this.dateStringified = this.stringifyDate(this.date);
  },
  methods: {
    updateDate(date: string) {
      const roundedMinutes = roundMinutes(new Date(date), this.step);
      this.$emit("change", roundedMinutes);
    },
    stringifyDate(date?: Date | string): string {
      if (!date) return "";
      return formatLocalDateTime(new Date(date));
    },
    enterKeyDown() {
      this.$emit("enter");
    },
  },
});
</script>
