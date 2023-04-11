<template>
  <OverCalendarV2
    v-model="calendarMarker"
    :title="volunteerName"
    :events="assignedTasks"
    :hour-to-scroll-to="hourToScrollTo"
  >
    <template #interval="{ date, time }">
      <div :class="{ available: isVolunteerAvailable(date, time) }" />
    </template>
    <template #event="{ event }">
      <div
        class="event underline-on-hover"
        @mouseup.middle="openFtNewTab(event.ft.id)"
        @contextmenu.prevent="selectTimespanToDisplayDetails(event.timespanId)"
      >
        {{ `[${event.ft.id}] ${event.ft.name}` }}
      </div>
    </template>
  </OverCalendarV2>
</template>

<script lang="ts">
import Vue from "vue";
import OverCalendarV2 from "~/components/atoms/OverCalendarV2.vue";
import { getColorByStatus } from "~/domain/common/status-color";
import { Availability } from "~/domain/volunteer-availability/volunteer-availability";
import { isPeriodIncludedByAnother } from "~/utils/availabilities/availabilities";
import { computeNextHourDate } from "~/utils/date/dateUtils";
import { Volunteer } from "~/utils/models/assignment";
import { CalendarItem } from "~/utils/models/calendar";
import { TimespanWithFt } from "~/utils/models/ftTimespan";
import { VolunteerTask } from "~/utils/models/user";
import { formatUsername } from "~/utils/user/userUtils";

interface CalendarItemWithTask extends CalendarItem {
  timespanId?: number;
  ft: { id: number; name: string };
}

export default Vue.extend({
  name: "OrgaTaskCalendar",
  components: { OverCalendarV2 },
  data: () => ({
    calendarMarker: new Date(),
  }),
  computed: {
    selectedVolunteer(): Volunteer | null {
      return this.$accessor.assignment.selectedVolunteer;
    },
    volunteerName(): string {
      if (!this.selectedVolunteer) return "";
      return formatUsername(this.selectedVolunteer);
    },
    manifDate(): Date {
      return new Date(this.$accessor.config.getConfig("event_date"));
    },
    availabilities(): Availability[] {
      return this.$accessor.volunteerAvailability.mAvailabilities;
    },
    hoverTimespan(): TimespanWithFt | null {
      return this.$accessor.assignment.hoverTimespan;
    },
    assignedTasks(): CalendarItemWithTask[] {
      const tasks = [
        ...this.$accessor.user.selectedUserFtRequests,
        ...this.$accessor.user.selectedUserAssignments,
      ];
      const timespans = this.hoverTimespan
        ? [this.formatTimespanForCalendar(this.hoverTimespan)]
        : [];
      return [
        ...tasks.map((task) => this.formatTaskForCalendar(task)),
        ...timespans,
      ];
    },
    hourToScrollTo(): number | null {
      return this.hoverTimespan?.start.getHours() ?? null;
    },
  },
  watch: {
    hoverTimespan() {
      this.calendarMarker = this.hoverTimespan?.start || this.manifDate;
    },
  },
  mounted() {
    this.calendarMarker = this.manifDate;
  },
  methods: {
    isVolunteerAvailable(date: string, time: string) {
      const start = new Date(`${date} ${time}`);
      const end = computeNextHourDate(start);
      return this.availabilities.some(
        isPeriodIncludedByAnother({ start, end })
      );
    },
    selectTimespanToDisplayDetails(timespanId?: number) {
      if (!timespanId) {
        return this.$accessor.notif.pushNotification({
          message: "La FT n'est pas prête à être affectée",
        });
      }
      this.$emit("display-timespan-details", timespanId);
    },

    openFtNewTab(ftId: number) {
      window.open(`/ft/${ftId}`);
    },
    formatTimespanForCalendar({
      ft,
      start,
      end,
    }: TimespanWithFt): CalendarItemWithTask {
      return {
        start,
        end,
        name: ft.name,
        timed: true,
        ft,
      };
    },
    formatTaskForCalendar({
      ft,
      start,
      end,
      timespanId,
    }: VolunteerTask): CalendarItemWithTask {
      return {
        start,
        end,
        name: ft.name,
        color: getColorByStatus(ft.status),
        timed: true,
        ft,
        timespanId,
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.available {
  background-color: rgba(95, 219, 72, 0.45);
  height: 100%;
  width: 100%;
}

.event {
  height: 100%;
  white-space: normal;
  padding: 2px;
  overflow: hidden;
}

.underline-on-hover:hover {
  text-decoration: underline;
}
</style>
