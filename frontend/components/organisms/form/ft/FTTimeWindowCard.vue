<template>
  <v-card>
    <v-card-title>Créneau</v-card-title>
    <v-card-text>
      <FTTimeWindowTable />
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="openAddDialog">Ajouter un créneau</v-btn>
    </v-card-actions>
    <TimeframeCalendar :timeframes="timeWindows" />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import FTTimeWindowTable from "~/components/molecules/timeframe/FTTimeWindowTable.vue";
import TimeframeCalendar from "~/components/molecules/timeframe/TimeframeCalendar.vue";
import { FT, FTTimeWindow } from "~/utils/models/ft";

export default Vue.extend({
  name: "FTTimeWindowCard",
  components: { FTTimeWindowTable, TimeframeCalendar },
  data: () => ({
    isAddDialogOpen: false,
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    timeWindows(): FTTimeWindow[] {
      return this.mFT.timeWindows;
    },
  },
  methods: {
    openAddDialog() {
      this.isAddDialogOpen = true;
    },
    closeAddDialog() {
      this.isAddDialogOpen = false;
    },
  },
});
</script>

<style scoped></style>
