<template>
  <div>
    <v-sheet tile height="54" class="d-flex">
      <v-btn icon class="ma-2" @click="$refs.FormCalendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-2" @click="$refs.FormCalendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-calendar
      ref="FormCalendar"
      type="week"
      color="primary"
      :events="timeframes"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      event-name="plage"
    ></v-calendar>
    <v-btn @click="showTimeframes">Test</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TimeframeCalendar",
  computed: {
    timeframes(): any {
      return this.$accessor.FA.mFA.time_window;
    },
    events(): Array<any> {
      const time_window = this.$accessor.FA.mFA.time_window;
      //if (time_window !== null)  return [...time_window];
      return [];
    },
  },
  methods: {
    showTimeframes() {
      console.log(this.$accessor.FA.mFA.time_window);
    },
  },
});
</script>

<style scoped></style>
