<template>
  <OverCalendarV2 v-model="calendarMarker" :title="ftName" :events="timespans">
    <template #event="{ event: timespan }">
      <div
        class="event underline-on-hover"
        :class="{ highlight: timespan.id === selectedTimespanId }"
        @click="selectTimespan(timespan)"
      >
        {{ timespan.name }}
      </div>
    </template>
  </OverCalendarV2>
</template>

<script lang="ts">
import Vue from "vue";
import OverCalendarV2 from "~/components/atoms/OverCalendarV2.vue";
import {
  FtTimespanEvent,
  FtWithTimespan,
  TimespansWithStats,
} from "~/utils/models/ftTimespan";

export default Vue.extend({
  name: "TaskOrgaCalendar",
  components: { OverCalendarV2 },
  data: () => ({
    calendarMarker: new Date(),
  }),
  computed: {
    selectedFt(): FtWithTimespan | null {
      return this.$accessor.assignment.selectedFt;
    },
    ftName(): string {
      if (this.selectedFt === null) {
        return "";
      }
      return `[${this.selectedFt.id}] ${this.selectedFt.name}`;
    },
    manifDate(): Date {
      return new Date(this.$accessor.config.getConfig("event_date"));
    },
    timespans(): FtTimespanEvent[] {
      return this.$accessor.assignment.selectedFtTimespans.map((timespan) =>
        this.mapTimespanToEvent(timespan)
      );
    },
    selectedTimespanId(): number | null {
      return this.$accessor.assignment.selectedTimespan?.id ?? null;
    },
  },
  mounted() {
    this.calendarMarker = this.manifDate;
  },
  methods: {
    selectTimespan(timespan: FtTimespanEvent) {
      this.$accessor.assignment.setSelectedTimespan(timespan);
    },
    mapTimespanToEvent(timespan: TimespansWithStats): FtTimespanEvent {
      return {
        ...timespan,
        start: new Date(timespan.start),
        end: new Date(timespan.end),
        name: this.buildEventName(timespan),
        timed: true,
        color: this.defineEventColor(timespan),
      };
    },
    buildEventName(timespan: TimespansWithStats): string {
      return `[${timespan.teamRequest.assignmentCount}/${timespan.teamRequest.quantity}] ${timespan.teamRequest.code}`;
    },
    getTeamColor(code: string): string {
      return this.$accessor.team.getTeamByCode(code).color;
    },
    defineEventColor(timespan: TimespansWithStats): string {
      const color = this.getTeamColor(timespan.teamRequest.code);
      const spread =
        (180 * timespan.teamRequest.assignmentCount) /
          timespan.teamRequest.quantity +
        75;
      return color + this.convertDecimalToHex(spread);
    },
    convertDecimalToHex(decimal: number): string {
      const hex = decimal.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    },
  },
});
</script>

<style lang="scss" scoped>
.event {
  height: 100%;
  white-space: normal;
  padding: 2px;
  overflow: hidden;
}

.highlight {
  border: solid;
}
</style>
