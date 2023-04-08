<template>
  <v-card>
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title>{{ taskTitle }}</v-card-title>
    <v-card-text>
      <div class="planning-list">
        <div class="planning">
          <div class="date-navigation">
            <v-btn icon @click="previousDay">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon @click="nextDay">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
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
          <div class="planning__teams">
            <TeamIconChip
              v-for="team of getAssignableTeams(mainCandidate)"
              :key="team"
              :team="team"
              with-name
              size="large"
              :class="{
                'not-selected': isAssignedAs(team, mainCandidate),
              }"
              @click="temporaryAssign(team, mainCandidate)"
            ></TeamIconChip>
          </div>
          <v-btn
            color="success"
            :class="{ invalid: areSomeCandidatesNotAssigned }"
            dark
            large
            class="planning__assignment"
            @click="assign"
          >
            <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>Affecter
          </v-btn>
        </div>
        <aside class="add-cadidate-corridor">
          <v-btn
            v-if="canAssignMoreVolunteer"
            id="add-candidate"
            fab
            dark
            large
            color="green"
          >
            <v-icon dark> mdi-account-multiple-plus </v-icon>
          </v-btn>
        </aside>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import TeamIconChip from "~/components/atoms/TeamIconChip.vue";
import VolunteerResumeCalendarHeader from "~/components/molecules/assignment/resume/VolunteerResumeCalendarHeader.vue";
import {
  AssignmentCandidate,
  TaskAssignment,
} from "~/domain/timespan-assignment/timespanAssignment";
import {
  convertTaskToPlanningEvent,
  createTemporaryTaskPlanningEvent,
} from "~/domain/common/planning-events";
import { Volunteer } from "~/utils/models/assignment";
import { SHIFT_HOURS } from "~/utils/shift/shift";
import { getUnderlyingTeams } from "~/domain/timespan-assignment/underlying-teams";

export default Vue.extend({
  name: "AssignmentForm",
  components: {
    VolunteerResumeCalendarHeader,
    TeamIconChip,
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
    mainCandidate(): AssignmentCandidate | undefined {
      return this.$accessor.assignment.taskAssignment.candidates.at(0);
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
    areSomeCandidatesNotAssigned(): boolean {
      return this.$accessor.assignment.taskAssignment.candidates.some(
        (candidate) => candidate.assignment === ""
      );
    },
    canAssignMoreVolunteer(): boolean {
      return this.$accessor.assignment.taskAssignment.canAssignMoreVolunteer;
    },
  },
  watch: {
    taskAssignment() {
      this.calendarDate = this.start;
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
    getAssignableTeams(candidate?: AssignmentCandidate): string[] {
      if (!candidate) return [];
      const underlyingTeams = getUnderlyingTeams(candidate.volunteer.teams);
      const teams = [...candidate.volunteer.teams, ...underlyingTeams];
      return teams.filter((team) =>
        this.taskAssignment.remainingTeamRequest.includes(team)
      );
    },
    temporaryAssign(teamCode: string, candidate?: AssignmentCandidate) {
      if (!candidate) return;
      const volunteerId = candidate.volunteer.id;
      if (candidate.assignment === teamCode) {
        this.$accessor.assignment.unassign(volunteerId);
      } else {
        this.$accessor.assignment.assign({ teamCode, volunteerId });
      }
    },
    isAssignedAs(teamCode: string, candidate?: AssignmentCandidate): boolean {
      if (!candidate) return false;
      return candidate.assignment !== teamCode;
    },
    assign() {
      if (this.areSomeCandidatesNotAssigned) return;
      this.$accessor.assignment.saveAssignments();
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
  justify-content: space-between;
  width: 100%;
}

.planning-list {
  display: flex;
  gap: 40px;
  .planning {
    flex-grow: 9;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    &__calendar {
      width: 100%;
    }
    &__teams {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      .not-selected {
        opacity: 0.4;
      }
    }
    &__assignment.invalid {
      opacity: 0.3;
      cursor: initial;
    }
  }
  .add-candidate-corridor {
    flex-grow: 1;
  }
}

#add-candidate {
  position: sticky;
  top: 55px;
}

.close-btn {
  position: absolute;
  top: 3px;
  right: 3px;
}
</style>
