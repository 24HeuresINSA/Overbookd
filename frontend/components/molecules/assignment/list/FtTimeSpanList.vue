<template>
  <div class="timespan-list" @mouseleave="hoverTimeSpan(null)">
    <v-virtual-scroll
      :items="timeSpans"
      item-height="70"
      class="virtual-scroll"
    >
      <template #default="{ item }">
        <v-list-item :key="item.id" @mouseover="hoverTimeSpan(item)">
          <TimeSpanResume
            :time-span="item"
            @selected-team="(team) => assign(item.id, team)"
          ></TimeSpanResume>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateWithMinutes } from "~/utils/date/dateUtils";
import { AvailableTimeSpan } from "~/utils/models/ftTimeSpan";
import TimeSpanResume from "../resume/TimeSpanResume.vue";
import { Volunteer } from "~/utils/models/assignment";

export default Vue.extend({
  name: "FtTimeSpanList",
  components: { TimeSpanResume },
  props: {
    timeSpans: {
      type: Array as () => AvailableTimeSpan[],
      required: true,
      default: () => [],
    },
  },
  computed: {
    selectedVolunteer(): Volunteer | null {
      return this.$accessor.assignment.selectedVolunteer;
    },
  },
  methods: {
    formatDate(date: Date) {
      return formatDateWithMinutes(date);
    },
    hoverTimeSpan(timeSpan: AvailableTimeSpan | null) {
      this.$accessor.assignment.setHoverTimeSpan(timeSpan);
    },
    assign(timeSpanId: number, teamCode: string) {
      if (!this.selectedVolunteer) return;
      const volunteerId = this.selectedVolunteer.id;
      this.$accessor.assignment.saveAssignment({
        timeSpanId,
        teamCode,
        volunteerId,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.timespan-list {
  width: 100%;
  height: 100%;
  overflow: auto;
  &__item {
    cursor: pointer;
  }
}
</style>
