<template>
  <v-text-field
    :value="date"
    :label="label"
    type="datetime-local"
    :min="min"
    :max="max"
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
      type: String,
      default: "",
    },
    min: {
      type: String,
      default: "",
    },
    max: {
      type: String,
      default: "",
    },
    boxed: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    propagateEvent(date: string) {
      this.$emit("change", this.roundMinutes(date));
    },
    roundMinutes(date: string): string | null {
      if (!date) return null;

      const dateObj = new Date(date);
      const minutes = dateObj.getMinutes();
      if (minutes % 15 === 0) return date;

      const minutesRounded = Math.round(minutes / 15) * 15;
      dateObj.setMinutes(minutesRounded);
      return formatDateForComponent(dateObj);
    },
  },
});
</script>
