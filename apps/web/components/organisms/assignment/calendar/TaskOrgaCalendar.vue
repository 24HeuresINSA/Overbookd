<template>
  <OverCalendar
    v-model="calendarMarker"
    :title="ftName"
    :events="timeSpans"
    :hour-to-scroll-to="hourToScrollTo"
  >
    <template #event="{ event: timeSpan }">
      <div
        class="event underline-on-hover"
        :class="{ highlight: timeSpan.id === selectedTimeSpanId }"
        @click="selectTimeSpan(timeSpan)"
        @mouseup.middle="openSelectedFtInNewTab()"
        @contextmenu.prevent="selectTimeSpanToDisplayDetails(timeSpan.id)"
      >
        {{ timeSpan.name }}
      </div>
    </template>
  </OverCalendar>
</template>

<script lang="ts">
import Vue from "vue";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import {
  FtTimeSpanEvent,
  FtTimeSpanWithRequestedTeams,
  FtWithTimeSpan,
  RequestedTeam,
} from "~/utils/models/ftTimeSpan";

export default Vue.extend({
  name: "TaskOrgaCalendar",
  components: { OverCalendar },
  data: () => ({
    calendarMarker: new Date(),
  }),
  computed: {
    selectedFt(): FtWithTimeSpan | null {
      return this.$accessor.assignment.selectedFt;
    },
    ftName(): string {
      if (this.selectedFt === null) {
        return "";
      }
      return `[${this.selectedFt.id}] ${this.selectedFt.name}`;
    },
    manifDate(): Date {
      return new Date(this.$accessor.configuration.get("eventDate")?.start);
    },
    timeSpans(): FtTimeSpanEvent[] {
      return this.$accessor.assignment.selectedFtTimeSpans.flatMap((timeSpan) =>
        this.mapTimeSpanToEvent(timeSpan)
      );
    },
    selectedTimeSpanId(): number | null {
      return this.$accessor.assignment.selectedTimeSpan?.id ?? null;
    },
    hourToScrollTo(): number | null {
      return this.timeSpans.at(0)?.start.getHours() ?? null;
    },
  },
  mounted() {
    this.calendarMarker = this.manifDate;
  },
  methods: {
    selectTimeSpan(timeSpan: FtTimeSpanEvent) {
      this.$accessor.assignment.setSelectedTimeSpan(timeSpan);
    },
    selectTimeSpanToDisplayDetails(timeSpanId: number) {
      this.$emit("display-time-span-details", timeSpanId);
    },
    mapTimeSpanToEvent(
      timeSpan: FtTimeSpanWithRequestedTeams
    ): FtTimeSpanEvent[] {
      return timeSpan.requestedTeams.map((team) => ({
        ...timeSpan,
        start: new Date(timeSpan.start),
        end: new Date(timeSpan.end),
        name: this.buildEventName(team),
        timed: true,
        color: this.defineEventColor(team),
      }));
    },
    buildEventName({ assignmentCount, quantity, code }: RequestedTeam): string {
      return `[${assignmentCount}/${quantity}] ${code}`;
    },
    getTeamColor(code: string): string {
      return this.$accessor.team.getTeamByCode(code).color;
    },
    defineEventColor({
      code,
      quantity,
      assignmentCount,
    }: RequestedTeam): string {
      const color = this.getTeamColor(code);
      const spread = (180 * assignmentCount) / quantity + 75;
      return color + this.convertDecimalToHex(spread);
    },
    convertDecimalToHex(decimal: number): string {
      const hex = decimal.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    },
    openSelectedFtInNewTab() {
      if (this.selectedFt === null) return;
      window.open(`/ft/${this.selectedFt.id}`);
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
