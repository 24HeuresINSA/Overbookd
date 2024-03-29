<template>
  <OverCalendar
    v-model="calendarMarker"
    :events="assignedTasks"
    :hour-to-scroll-to="hourToScrollTo"
  >
    <template #title>
      <div v-show="selectedVolunteer" class="title">
        <h1 class="title__name">{{ volunteerName }}</h1>
        <span v-show="stats.length > 0">|</span>
        <AssignmentUserStats :stats="stats" class="title__stats" />
      </div>
    </template>
    <template #interval="{ date, hour }">
      <div
        :class="{ available: isVolunteerAvailableDuringThisHour(date, hour) }"
      />
    </template>
    <template #event="{ event }">
      <div
        class="event underline-on-hover"
        @mouseup.middle="openFtInNewTab(event.ft.id)"
        @contextmenu.prevent="selectTimeSpanToDisplayDetails(event.timeSpanId)"
      >
        {{ `[${event.ft.id}] ${event.ft.name}` }}
      </div>
    </template>
  </OverCalendar>
</template>

<script lang="ts">
import Vue from "vue";
import { DateString, Hour, Period } from "@overbookd/period";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import AssignmentUserStats from "~/components/molecules/user/AssignmentUserStats.vue";
import { getColorByStatus } from "~/domain/common/status-color";
import { Volunteer } from "~/utils/models/assignment.model";
import { CalendarEvent } from "~/utils/models/calendar.model";
import { AvailableTimeSpan } from "~/utils/models/ft-time-span.model";
import {
  VolunteerAssignmentStat,
  VolunteerTask,
} from "~/utils/models/user.model";
import { formatUsername } from "~/utils/user/user.utils";
import { isItAvailableDuringThisHour } from "~/utils/availabilities/availabilities";

type CalendarItemWithTask = CalendarEvent & {
  timeSpanId?: number;
  ft: { id: number; name: string };
};

export default Vue.extend({
  name: "OrgaTaskCalendar",
  components: { OverCalendar, AssignmentUserStats },
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
      return this.$accessor.configuration.eventStartDate;
    },
    availabilities(): Period[] {
      return this.$accessor.volunteerAvailability.availabilities.list;
    },
    hoverTimeSpan(): AvailableTimeSpan | null {
      return this.$accessor.assignment.hoverTimeSpan;
    },
    assignedTasks(): CalendarItemWithTask[] {
      const tasks = [
        ...this.$accessor.user.selectedUserFtRequests,
        ...this.$accessor.user.selectedUserAssignments,
      ];
      const timeSpans = this.hoverTimeSpan
        ? [this.formatTimeSpanForCalendar(this.hoverTimeSpan)]
        : [];
      return [
        ...tasks.map((task) => this.formatTaskForCalendar(task)),
        ...timeSpans,
      ];
    },
    hourToScrollTo(): number | null {
      return this.hoverTimeSpan?.start.getHours() ?? null;
    },
    stats(): VolunteerAssignmentStat[] {
      return this.$accessor.user.selectedUserAssignmentStats;
    },
  },
  watch: {
    hoverTimeSpan() {
      this.calendarMarker = this.hoverTimeSpan?.start || this.manifDate;
    },
  },
  async mounted() {
    await this.$accessor.configuration.fetch("eventDate");
    this.calendarMarker = this.manifDate;
  },
  methods: {
    isVolunteerAvailableDuringThisHour(date: DateString, hour: Hour) {
      return isItAvailableDuringThisHour(this.availabilities, date, hour);
    },
    selectTimeSpanToDisplayDetails(timeSpanId?: number) {
      if (!timeSpanId) {
        return this.$accessor.notif.pushNotification({
          message: "La FT n'est pas prête à être affectée",
        });
      }
      this.$emit("display-time-span-details", timeSpanId);
    },
    openFtInNewTab(ftId: number) {
      window.open(`/ft/${ftId}`);
    },
    formatTimeSpanForCalendar({
      ft,
      start,
      end,
    }: AvailableTimeSpan): CalendarItemWithTask {
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
      timeSpanId,
    }: VolunteerTask): CalendarItemWithTask {
      return {
        start,
        end,
        name: ft.name,
        color: getColorByStatus(ft.status),
        timed: true,
        ft,
        timeSpanId,
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  &__name {
    font-size: 1.4rem;
    font-weight: 500;
    margin-right: 8px;
  }
  &__stats {
    margin-top: 2px;
    margin-left: 8px;
  }
}

.available {
  background-color: $calendar-available-background-color;
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
