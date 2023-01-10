<template>
  <v-card :style="isDisabled ? `border-left: 5px solid green` : ``">
    <v-card-title>Créneau</v-card-title>
    <v-card-text>
      <CompleteTimeframeTable
        :store="store"
        :is-disabled="isDisabled"
      ></CompleteTimeframeTable>
      <TimeframeCalendar :timeframes="timeWindowsList" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Timeframe } from "~/utils/models/timeframe";
import CompleteTimeframeTable from "~/components/molecules/timeframe/CompleteTimeframeTable.vue";
import TimeframeCalendar from "~/components/molecules/timeframe/TimeframeCalendar.vue";
import { FT, FTTimeWindow } from "~/utils/models/ft";

export default Vue.extend({
  name: "FTTimeWindowCard",
  components: { CompleteTimeframeTable, TimeframeCalendar },
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
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    timeWindowsList(): FTTimeWindow {
      return this.mFT.timeWindows;
    },
  },
  methods: {
    addTimeframe(timeframe: Timeframe) {
      this.store.addTimeframe({ ...timeframe });
    },
    setTimeframes(timeframes: Timeframe[]) {
      const store = this.$accessor.FT;
      // store.addTimeframes(timeframes);
    },
  },
});
</script>

<style scoped></style>
