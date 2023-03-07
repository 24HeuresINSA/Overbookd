<template>
  <v-text-field
    v-model="dateStringified"
    :label="label"
    type="date"
    :solo="boxed"
    :filled="boxed"
    :disabled="disabled"
    return-object
    @change="updateDate"
  >
  </v-text-field>
</template>

<script lang="ts">
import Vue from "vue";
import { formatLocalDate } from "~/utils/date/dateUtils";

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
      type: [String, Date],
      default: () => undefined as Date | string | undefined,
    },
    boxed: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
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
      this.$emit("change", date);
    },
    stringifyDate(date?: Date | string): string {
      if (!date) return "";
      return formatLocalDate(new Date(date));
    },
  },
});
</script>
