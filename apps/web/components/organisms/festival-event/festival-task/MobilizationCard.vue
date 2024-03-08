<template>
  <v-card>
    <v-card-title>
      Mobilisations
      <v-btn
        fab
        dark
        small
        class="calendar-btn"
        color="primary"
        @click="openCalendar"
      >
        <v-icon dark> mdi-calendar-blank </v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <MobilizationTable
        @add="addMobilization"
        @update="updateMobilization"
        @remove="removeMobilization"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MobilizationTable from "~/components/molecules/festival-event/mobilization/MobilizationTable.vue";
import { Mobilization, UpdateMobilization } from "@overbookd/festival-event";
import { AddMobilizationForm } from "@overbookd/http";

export default defineComponent({
  name: "MobilizationCard",
  components: { MobilizationTable },
  emits: ["open:calendar"],
  methods: {
    addMobilization(mobilization: AddMobilizationForm) {
      this.$accessor.festivalTask.addMobilization(mobilization);
    },
    updateMobilization(
      mobilizationId: Mobilization["id"],
      mobilization: UpdateMobilization,
    ) {
      this.$accessor.festivalTask.updateMobilization({
        mobilizationId,
        mobilization,
      });
    },
    removeMobilization(mobilization: Mobilization) {
      this.$accessor.festivalTask.removeMobilization(mobilization.id);
    },
    openCalendar() {
      this.$emit("open:calendar");
    },
  },
});
</script>

<style lang="scss" scoped>
.calendar-btn {
  margin-left: 10px;
}
</style>
