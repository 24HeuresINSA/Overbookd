<template>
  <v-card>
    <v-card-title>Créneau</v-card-title>
    <v-card-text>
      <CompleteTimeframeTable
        :store="store"
        :is-disabled="isDisabled"
      ></CompleteTimeframeTable>
      <TimeframeSelector
        v-if="!isDisabled"
        @add-timeframe="addTimeframe"
      ></TimeframeSelector>
    </v-card-text>
  </v-card>
</template>

<script>
import CompleteTimeframeTable from "./CompleteTimeframeTable";
import TimeframeSelector from "./timeframeSelector";

export default {
  name: "CompleteTimeframeCard",
  components: { TimeframeSelector, CompleteTimeframeTable },
  props: {
    store: {
      type: Object,
      default: () => ({}),
    },
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },

  methods: {
    addTimeframe(timeframe) {
      this.store.addTimeframe(timeframe);
    },
  },
};
</script>

<style scoped></style>
