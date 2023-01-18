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
import { formatDateForComponent } from "~/utils/date/dateUtils";

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
      this.$emit("change", this.roundMinutes(new Date(date)));
    },
    roundMinutes(date: Date): Date | null {
      if (!date) return null;

      const minutes = date.getMinutes();
      if (minutes % 15 === 0) return date;

      const minutesRounded = Math.round(minutes / 15) * 15;
      date.setMinutes(minutesRounded);
      return date;
    },
    stringifyDate(date?: Date | string): string {
      if (!date) return "";
      return formatDateForComponent(new Date(date));
    },
  },
});
</script>
