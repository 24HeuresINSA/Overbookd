<template>
  <div>
    <OverCalendar
      v-model="calendarCentralDate"
      :events="events"
      class="no-scroll elevation-2"
      @click:time="openCreateBreakPeriodIfNeeded"
    >
      <template #title>
        <div class="calendar-title__content">
          <h1>{{ user?.firstname }} {{ user?.lastname }}</h1>
          <div class="ml-4">
            <TeamChip
              v-for="team in user?.teams"
              :key="team"
              :team="team"
              :with-name="isDesktop"
              class="mr-2"
            ></TeamChip>
          </div>
          <AssignmentUserStats
            v-show="shouldShowStats"
            :stats="stats"
            class="user-stats"
          ></AssignmentUserStats>
        </div>
      </template>
      <template #interval="{ date, hour }">
        <div :class="{ available: isUserAvailable(date, hour) }" />
      </template>
      <template #event="{ event }">
        <div
          class="event"
          @click="openTaskOrBreakDeletion(event)"
          @contextmenu.prevent="openTaskOrBreakDeletion(event)"
        >
          <strong>{{ event.name }}</strong> <br />
          <span v-if="event.end">
            {{ displayForCalendar(event.start) }} -
            {{ displayForCalendar(event.end) }}
          </span>
        </div>
      </template>
    </OverCalendar>
    <v-dialog v-model="isCreateBreakPeriodOpen" max-width="800">
      <CreateBreakPeriodCard
        v-if="selectedDate"
        :start="selectedDate.date"
        @create="addBreakPeriod"
        @close-dialog="closeCreateBreakPeriodDialog"
      />
    </v-dialog>
    <v-dialog v-model="isDeleteBreakPeriodOpen" max-width="800">
      <ConfirmationMessage
        v-if="selectedBreak"
        confirm-color="error"
        abort-color="success"
        @close-dialog="cancelBreakPeriodDeletion"
        @confirm="deleteBreakPeriod"
      >
        <template #title>Supprimer le créneau de pause</template>
        <template #statement>
          <div class="delete-statement">
            <p>Tu vas supprimer la pause de</p>
            <v-chip color="primary">
              <v-icon left>mdi-clock</v-icon>
              <span>{{ selectedBreak.toString() }}</span>
            </v-chip>
          </div>
        </template>
        <template #confirm-btn-content>
          <v-icon left> mdi-delete-empty-outline </v-icon>Supprimer
        </template>
      </ConfirmationMessage>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { DateString, Hour, OverDate, Period } from "@overbookd/period";
import { UserPersonalData } from "@overbookd/user";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { getColorByStatus } from "~/domain/common/status-color";
import { VolunteerAssignmentStat } from "~/utils/models/user.model";
import { formatUsername } from "~/utils/user/user.utils";
import AssignmentUserStats from "~/components/molecules/user/AssignmentUserStats.vue";
import { isItAvailableDuringThisHour } from "~/utils/availabilities/availabilities";
import { CalendarEvent } from "~/utils/models/calendar.model";
import { PlanningTask } from "@overbookd/http";
import { PlanningEvent } from "@overbookd/assignment";
import { BreakDefinition } from "@overbookd/planning";
import { isDesktop } from "~/utils/device/device.utils";
import CreateBreakPeriodCard from "~/components/molecules/planning/CreateBreakPeriodCard.vue";
import { convertToCalendarBreak, PAUSE } from "~/domain/common/planning-events";
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";
import { displayForCalendar } from "~/utils/date/date.utils";

type UserCalendarData = {
  calendarCentralDate: Date;
  selectedDate: OverDate | null;
  isCreateBreakPeriodOpen: boolean;
  isDeleteBreakPeriodOpen: boolean;
  selectedBreak: Period | null;
};

function isBreakPeriodEvent(event: CalendarEvent): boolean {
  return event.name === PAUSE;
}

export default Vue.extend({
  name: "UserCalendar",
  components: {
    OverCalendar,
    TeamChip,
    AssignmentUserStats,
    CreateBreakPeriodCard,
    ConfirmationMessage,
  },
  props: {
    userId: { type: Number, default: () => 0 },
  },
  data: (): UserCalendarData => ({
    calendarCentralDate: new Date(),
    selectedDate: null,
    isCreateBreakPeriodOpen: false,
    isDeleteBreakPeriodOpen: false,
    selectedBreak: null,
  }),
  computed: {
    availabilities(): Period[] {
      return this.$accessor.volunteerAvailability.availabilities.list;
    },
    assignments(): PlanningEvent[] {
      return this.$accessor.user.selectedUserAssignments;
    },
    breakPeriods(): Period[] {
      return this.$accessor.user.selectedUserBreakPeriods;
    },
    tasks(): PlanningTask[] {
      return this.$accessor.user.selectedUserTasks;
    },
    stats(): VolunteerAssignmentStat[] {
      return this.$accessor.user.selectedUserAssignmentStats;
    },
    events(): CalendarEvent[] {
      const assignmentEvents = this.assignments.map(
        ({ start, end, task }): CalendarEvent => ({
          start,
          end,
          name: `[${task.id}] ${task.name}`,
          link: `/ft/${task.id}`,
          color: getColorByStatus(task.status),
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
      const breakEvents = this.breakPeriods.map(convertToCalendarBreak);
      return [...assignmentEvents, ...tasksEvents, ...breakEvents];
    },
    user(): UserPersonalData {
      return this.$accessor.user.selectedUser;
    },
    isDesktop(): boolean {
      return isDesktop();
    },
    shouldShowStats(): boolean {
      return this.$accessor.user.can(AFFECT_VOLUNTEER) && this.isDesktop;
    },
    manifDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
  },
  async created() {
    await Promise.all([
      this.$accessor.user.findUserById(this.userId),
      this.$accessor.volunteerAvailability.fetchVolunteerAvailabilities(
        this.userId,
      ),
      this.$accessor.user.getVolunteerAssignments(this.userId),
      this.$accessor.user.getVolunteerTasks(this.userId),
      this.$accessor.user.getVolunteerBreakPeriods(this.userId),
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
      const overDate = OverDate.init({ date, hour });
      return isItAvailableDuringThisHour(this.availabilities, overDate);
    },
    openFtInNewTab(path?: string) {
      if (!path) return;
      window.open(path, "_blank");
    },
    openCreateBreakPeriodIfNeeded(date: OverDate) {
      if (!this.$accessor.user.can(AFFECT_VOLUNTEER)) return;
      if (date.isIncludedBy(this.events)) return;
      if (!isItAvailableDuringThisHour(this.availabilities, date)) {
        return;
      }
      this.selectedDate = date;
      this.isCreateBreakPeriodOpen = true;
    },
    closeCreateBreakPeriodDialog() {
      this.isCreateBreakPeriodOpen = false;
    },
    addBreakPeriod(during: BreakDefinition["during"]) {
      this.closeCreateBreakPeriodDialog();
      const breakDefinition = { volunteer: this.user.id, during };
      this.$accessor.user.addVolunteerBreakPeriods(breakDefinition);
    },
    openTaskOrBreakDeletion(event: CalendarEvent) {
      if (isBreakPeriodEvent(event)) {
        this.isDeleteBreakPeriodOpen = true;
        this.selectedBreak = Period.init(event);
      }
      if (!event.link) return;
      this.openFtInNewTab(event.link);
    },
    cancelBreakPeriodDeletion() {
      this.isDeleteBreakPeriodOpen = false;
    },
    deleteBreakPeriod() {
      if (!this.selectedBreak) return;
      const volunteer = this.user.id;
      const period = this.selectedBreak;
      this.$accessor.user.deleteVolunteerBreakPeriods({ volunteer, period });
    },
    displayForCalendar,
  },
});
</script>

<style lang="scss" scoped>
.calendar-title__content {
  flex-direction: row;
  text-align: center;
  line-height: 1;
  padding: 6px 0 4px 0;
  @media only screen and (min-width: $mobile-max-width) {
    padding-top: 0;
  }
  .user-stats {
    justify-content: center;
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

.user-stats {
  margin-top: 3px;
  margin-left: 3px;
}

.event {
  height: 100%;
  white-space: normal;
  padding: 2px;
  overflow: hidden;
}

.delete-statement {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
</style>
