<template>
  <v-card :style="isDisabled ? `border-left: 5px solid green` : ``">
    <v-card-title>Créneau</v-card-title>
    <v-card-text>
      <CompleteTimeframeTable
        :store="store"
        :is-disabled="isDisabled"
      ></CompleteTimeframeTable>
      <TimeframeSelector
        complete
        :disabled="isDisabled"
        :store="store"
        @add-timeframe="addTimeframe"
        @set-timeframes="setTimeframes"
      ></TimeframeSelector>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Timeframe } from "~/utils/models/timeframe";
import CompleteTimeframeTable from "~/components/molecules/timeframe/CompleteTimeframeTable.vue";
import TimeframeSelector from "~/components/molecules/timeframe/TimeframeSelector.vue";

export default Vue.extend({
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
    addTimeframe(timeframe: Timeframe) {
      this.store.addTimeframe({ ...timeframe });
    },
    setTimeframes(timeframes: Timeframe[]) {
      const store = this.$accessor.FT;
      store.addTimeframes(timeframes);
    },
  },
});
</script>

<style scoped></style>
