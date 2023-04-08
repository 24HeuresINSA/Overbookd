<template>
  <v-card>
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title>{{ taskTitle }}</v-card-title>
    <v-card-text>
      <div class="date-navigation">
        <v-btn icon class="ma-2" @click="previousDay">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer />
        <v-btn icon class="ma-2" @click="nextDay">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <div class="planning">
        <v-calendar
          ref="calendar"
          v-model="calendarDate"
          type="category"
          category-show-all
          :categories="volunteerIds"
          :events="events"
          :interval-height="24"
          class="planning__calendar"
        >
          <template #category="{ category }">
            <VolunteerResumeCalendarHeader
              v-if="retrieveVolunteer(category)"
              :volunteer="retrieveVolunteer(category)"
            ></VolunteerResumeCalendarHeader>
          </template>
          <template #interval="{ hour, time, timeToY }">
            <div
              :class="{
                shift: isShiftHour(hour),
                'shift-party': isPartyHour(hour),
                'shift-day': isDayHour(hour),
                'shift-night': isNightHour(hour),
                'theme--dark': isDarkTheme,
              }"
              :style="{ top: `calc(${timeToY(time)}px - 2px)` }"
            ></div>
          </template>
        </v-calendar>
        <v-btn
          v-if="mainVolunteer?.friendAvailable"
          class="planning_add-candidate"
          fab
          dark
          large
          color="green"
        >
          <v-icon dark> mdi-account-multiple-plus </v-icon>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import VolunteerResumeCalendarHeader from "~/components/molecules/assignment/resume/VolunteerResumeCalendarHeader.vue";
import { TaskAssignment } from "~/domain/timespan-assignment/timespanAssignment";
import {
  convertTaskToPlanningEvent,
  createTemporaryTaskPlanningEvent,
} from "~/domain/common/planning-events";
import { Volunteer } from "~/utils/models/assignment";
import { SHIFT_HOURS } from "~/utils/shift/shift";

export default Vue.extend({
  name: "AssignmentForm",
  components: {
    VolunteerResumeCalendarHeader,
  },
  data: () => {
    return {
      calendarDate: new Date(),
    };
  },
  computed: {
    taskAssignment(): TaskAssignment {
      return this.$accessor.assignment.taskAssignment;
    },
    taskTitle(): string {
      return this.$accessor.assignment.taskAssignment.task.name;
    },
    mainVolunteer(): Volunteer | undefined {
      return this.$accessor.assignment.taskAssignment.candidates.at(0)
        ?.volunteer;
    },

    start(): Date {
      return this.$accessor.assignment.taskAssignment.task.start;
    },
    volunteerIds(): string[] {
      return this.$accessor.assignment.taskAssignment.candidates.map((c) =>
        c.volunteer.id.toString()
      );
    },
    events() {
      return this.$accessor.assignment.taskAssignment.candidates.flatMap(
        ({ volunteer, tasks }) => {
          const currentTask = this.$accessor.assignment.taskAssignment.task;
          return [
            ...tasks.map((task) =>
              convertTaskToPlanningEvent(task, volunteer.id.toString())
            ),
            createTemporaryTaskPlanningEvent(
              currentTask,
              volunteer.id.toString()
            ),
          ];
        }
      );
    },
    isDarkTheme(): boolean {
      return this.$accessor.theme.darkTheme;
    },
  },
  mounted() {
    this.calendarDate = this.start;
  },
  methods: {
    retrieveVolunteer(id: string): Volunteer | undefined {
      return this.taskAssignment.getCandidate(+id)?.volunteer;
    },
    isPartyHour(hour: number): boolean {
      return hour === SHIFT_HOURS.PARTY;
    },
    isDayHour(hour: number): boolean {
      return hour === SHIFT_HOURS.DAY;
    },
    isNightHour(hour: number): boolean {
      return hour === SHIFT_HOURS.NIGHT;
    },
    isShiftHour(hour: number): boolean {
      return (
        this.isDayHour(hour) || this.isNightHour(hour) || this.isPartyHour(hour)
      );
    },
    previousDay() {
      const calendar = this.$refs.calendar as any;
      if (calendar) calendar.prev();
    },
    nextDay() {
      const calendar = this.$refs.calendar as any;
      if (calendar) calendar.next();
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss">
.shift {
  height: 5px;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;
  &.theme--dark {
    &.shift-night {
      background-color: beige;
    }
  }
  &-party {
    background-color: purple;
  }
  &-night {
    background-color: black;
  }
  &-day {
    background-color: darksalmon;
  }
}

.date-navigation {
  display: flex;
}

.planning {
  display: flex;
  gap: 40px;
  &__calendar {
    flex-grow: 5;
  }
  &__add-candidate {
    flex-grow: 1;
  }
}

.close-btn {
  position: absolute;
  top: 3px;
  right: 3px;
}
</style>
