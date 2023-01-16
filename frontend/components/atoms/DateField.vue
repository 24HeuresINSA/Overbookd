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
  watch: {
    date() {
      this.propagateEvent(this.date);
    },
  },
  methods: {
    propagateEvent(date: string | null) {
      this.$emit("change", date);
    },
  },
});
</script>
