<template>
  <v-text-field
    :value="dateStringified"
    :label="label"
    type="datetime-local"
    :min="minStringified"
    :max="maxStringified"
    :solo="boxed"
    :filled="boxed"
    return-object
    @change="propagateEvent"
  >
  </v-text-field>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateForComponent, roundMinutes } from "~/utils/date/dateUtils";

export default Vue.extend({
  name: "DateField",
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
    min: {
      type: Date,
      default: () => undefined as Date | undefined,
    },
    max: {
      type: Date,
      default: () => undefined as Date | undefined,
    },
    boxed: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    dateStringified(): string {
      return this.stringifyDate(this.date);
    },
    minStringified(): string {
      return this.stringifyDate(this.min);
    },
    maxStringified(): string {
      return this.stringifyDate(this.max);
    },
  },
  methods: {
    propagateEvent(date: string) {
      const roundedMinutes = roundMinutes(new Date(date), 15);
      this.$emit("change", roundedMinutes);
    },
    stringifyDate(date?: Date | string): string {
      if (!date) return "";
      return formatDateForComponent(new Date(date));
    },
  },
});
</script>
