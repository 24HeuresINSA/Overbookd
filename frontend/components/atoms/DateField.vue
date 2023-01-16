<template>
  <v-text-field
    :value="date"
    :label="label"
    type="datetime-local"
    :solo="boxed"
    :filled="boxed"
    return-object
    @change="propagateEvent"
  >
  </v-text-field>
</template>

<script lang="ts">
import Vue from "vue";

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
      default: null,
    },
    boxed: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    propagateEvent(date: string | null) {
      this.$emit("change", this.roundMinutes(date));
    },
    roundMinutes(date: string | null): string | null {
      if (!date) return null;

      const dateObj = new Date(date);
      const minutes = dateObj.getMinutes();
      if (minutes % 15 === 0) return date;

      const minutesRounded = Math.round(minutes / 15) * 15;
      dateObj.setHours(dateObj.getHours() + 1);
      dateObj.setMinutes(minutesRounded);
      return dateObj.toISOString().slice(0, -8);
    },
  },
});
</script>
