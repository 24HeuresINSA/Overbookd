<template>
  <OverCalendar
    v-model="calendarCentralDate"
    :events="events"
    class="no-scroll elevation-2"
  >
    <template #title>
      <h1>{{ user?.firstname }} {{ user?.lastname }}</h1>
      <div class="ml-4">
        <TeamChip
          v-for="team in user?.teams"
          :key="team"
          :team="team"
          :with-name="true"
          class="mr-2"
        ></TeamChip>
      </div>
      <AssignmentUserStats
        v-show="shouldShowStats"
        :stats="stats"
        class="user-stats"
      ></AssignmentUserStats>
    </template>
    <template #interval="{ date, hour }">
      <div :class="{ available: isUserAvailable(date, hour) }" />
    </template>
    <template #event="{ event }">
      <div
        class="event underline-on-hover"
        @click="openFt(event.link)"
        @mouseup.middle="openFtInNewTab(event.link)"
      >
        {{ event.name }}
      </div>
    </template>
  </OverCalendar>
</template>

<script lang="ts">
import Vue from "vue";
import { DateString, Hour, Period } from "@overbookd/period";
import { UserPersonalData } from "@overbookd/user";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { getColorByStatus } from "~/domain/common/status-color";
import {
  VolunteerAssignmentStat,
  VolunteerTask,
} from "~/utils/models/user.model";
import { formatUsername } from "~/utils/user/user.utils";
import AssignmentUserStats from "~/components/molecules/user/AssignmentUserStats.vue";
import { isItAvailableDuringThisHour } from "~/utils/availabilities/availabilities";
import { CalendarEvent } from "~/utils/models/calendar.model";
import { PlanningTask } from "@overbookd/http";

export default Vue.extend({
  name: "UserCalendar",
  components: { OverCalendar, TeamChip, AssignmentUserStats },
  props: {
    userId: {
      type: Number,
      default: () => 0,
    },
  },
  data: function () {
    return {
      calendarCentralDate: new Date(),
    };
  },
  computed: {
    availabilities(): Period[] {
      return this.$accessor.volunteerAvailability.availabilities.list;
    },
    assignments(): VolunteerTask[] {
      return this.$accessor.user.selectedUserAssignments;
    },
    tasks(): PlanningTask[] {
      return this.$accessor.user.selectedUserTasks;
    },
    stats(): VolunteerAssignmentStat[] {
      return this.$accessor.user.selectedUserAssignmentStats;
    },
    events(): CalendarEvent[] {
      const assignmentEvents = this.assignments.map(
        ({ start, end, ft }): CalendarEvent => ({
          start,
          end,
          name: `[${ft.id}] ${ft.name}`,
          link: `/ft/${ft.id}`,
          color: getColorByStatus(ft.status),
          timed: true,
        }),
      );
      const tasksEvents = this.tasks.map(
        ({ name, id, status, timeWindow: { start, end } }): CalendarEvent => ({
          start,
          end,
          name: `[${id}] ${name}`,
          link: `/ft/${id}`,
          color: getColorByStatus(status),
          timed: true,
        }),
      );
      return [...assignmentEvents, ...tasksEvents];
    },
    user(): UserPersonalData {
      return this.$accessor.user.selectedUser;
    },
    shouldShowStats(): boolean {
      return this.$accessor.user.can(AFFECT_VOLUNTEER);
    },
    manifDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
  },
  async created() {
    await Promise.all([
      this.$accessor.user.findUserById(this.userId),
      this.$accessor.user.getUserFtRequests(this.userId),
      this.$accessor.volunteerAvailability.fetchVolunteerAvailabilities(
        this.userId,
      ),
      this.$accessor.user.getVolunteerAssignments(this.userId),
      this.$accessor.user.getVolunteerTasks(this.userId),
    ]);

    if (this.shouldShowStats) {
      await this.$accessor.user.getVolunteerAssignmentStats(this.userId);
    }

    await this.$accessor.configuration.fetch("eventDate");
    this.calendarCentralDate = this.manifDate;
    document.title = formatUsername(this.user);
  },
  methods: {
    updateDate(date: Date) {
      this.calendarCentralDate = date;
    },
    isUserAvailable(date: DateString, hour: Hour): boolean {
      return isItAvailableDuringThisHour(this.availabilities, date, hour);
    },
    openFt(path?: string) {
      if (!path) return;
      this.$router.push({ path });
    },
    openFtInNewTab(path?: string) {
      if (!path) window.open(path);
    },
  },
});
</script>

<style lang="scss" scoped>
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

.user-stats {
  margin-top: 3px;
  margin-left: 3px;
}
</style>
