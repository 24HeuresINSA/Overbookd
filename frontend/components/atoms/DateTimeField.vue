<template>
  <v-text-field
    v-model="dateStringified"
    :label="label"
    type="datetime-local"
    :solo="boxed"
    :filled="boxed"
    return-object
    @change="updateDate"
  >
  </v-text-field>
</template>

<script lang="ts">
import Vue from "vue";
import { formatLocalDateTime, roundMinutes } from "~/utils/date/dateUtils";

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
  },
  data: () => ({
    dateStringified: "",
  }),
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
  },
});
</script>
