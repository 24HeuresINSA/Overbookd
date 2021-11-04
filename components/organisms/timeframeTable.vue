<template>
  <v-card :style="isDisabled ? `border-left: 5px solid green` : ``">
    <v-card-title>Créneaux</v-card-title>

    <v-data-table :headers="headers" :items="timeframes">
      <template #[`item.date`]="{ item }">
        {{ new Date(item.start).toDateString() }}
      </template>
      <template #[`item.start`]="{ item }">
        {{ new Date(item.start).toLocaleTimeString() }}
      </template>
      <template #[`item.end`]="{ item }">
        {{ new Date(item.end).toLocaleTimeString() }}
      </template>
      <template #[`item.action`]="{ index }">
        <v-btn v-if="!isDisabled" icon>
          <v-icon @click="deleteTimeframe(index)">mdi-trash-can</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <TimeframeSelector
      v-if="!isDisabled"
      @add-timeframe="addTimeframe"
      @set-timeframes="setTimeframes"
    ></TimeframeSelector>
  </v-card>
</template>

<script>
import TimeframeSelector from "./form/timeframeSelector";

export default {
  name: "TimeframeTable",
  components: { TimeframeSelector },
  props: {
    initTimeframes: {
      type: Array,
      default: () => [],
    },
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    headers: [
      { text: "date", value: "date" },
      { text: "debut", value: "start" },
      {
        text: "fin",
        value: "end",
      },
      { text: "action", value: "action" },
    ],
  }),
  computed: {
    mFA: function () {
      return this.$accessor.FA.mFA;
    },
    timeframes: function () {
      return this.$accessor.FA.mFA.timeframes;
    },
  },
  methods: {
    setTimeframes(timeframes) {
      const store = this.$accessor.FA;
      store.addTimeframes(timeframes);
    },

    addTimeframe(timeframe) {
      this.$accessor.FA.addTimeframe(timeframe);
    },
    deleteTimeframe(index) {
      this.$accessor.FA.deleteTimeframe(index);
    },
  },
};
</script>

<style scoped></style>
