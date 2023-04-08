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
              <div class="candidate">
                <v-btn
                  v-if="isReplacable(category)"
                  icon
                  @click="previousCandidate"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <VolunteerResumeCalendarHeader
                  v-if="retrieveVolunteer(category)"
                  :volunteer="retrieveVolunteer(category)"
                ></VolunteerResumeCalendarHeader>
                <v-btn
                  v-if="isReplacable(category)"
                  icon
                  @click="nextCandidate"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
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
            <div
              v-for="candidate in candidates"
              :key="candidate.volunteer.id"
              class="candidate-teams"
            >
              <TeamIconChip
                v-for="team of getAssignableTeams(candidate)"
                :key="team"
                :team="team"
                with-name
                size="large"
                :class="{
                  'not-selected': isNotAssignedAs(team, candidate),
                }"
                @click="temporaryAssign(team, candidate)"
              ></TeamIconChip>
            </div>
          </div>
          <v-btn
            color="success"
            :class="{ invalid: canNotAssign }"
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
            @click="addCandidate"
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
      candidateIndex: 0,
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
    canNotAssign(): boolean {
      return !this.$accessor.assignment.taskAssignment.canAssign;
    },
    canAssignMoreVolunteer(): boolean {
      return this.$accessor.assignment.taskAssignment.canAssignMoreVolunteer;
    },
    areOtherFriendsAvailable(): boolean {
      return (
        this.$accessor.assignment.taskAssignment.potentialCandidates.length > 0
      );
    },
    candidates(): AssignmentCandidate[] {
      return this.$accessor.assignment.taskAssignment.candidates;
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
    isNotAssignedAs(
      teamCode: string,
      candidate?: AssignmentCandidate
    ): boolean {
      if (!candidate) return false;
      return candidate.assignment !== teamCode;
    },
    assign() {
      if (this.canNotAssign) return;
      this.$accessor.assignment.saveAssignments();
    },
    addCandidate() {
      this.$accessor.assignment.addCandidate();
      this.candidateIndex = 0;
    },
    previousCandidate() {
      this.$accessor.assignment.previousCandidate();
    },
    nextCandidate() {
      this.$accessor.assignment.nextCandidate();
    },
    isReplacable(volunteerId: string): boolean {
      return (
        this.isLastAddedCandidate(volunteerId) &&
        this.areOtherFriendsAvailable &&
        !this.isFirstAddedCandidate(volunteerId)
      );
    },
    isLastAddedCandidate(volunteerId: string): boolean {
      const candidateIndex = this.taskAssignment.candidates.findIndex(
        (candidate) => candidate.volunteer.id === +volunteerId
      );
      return candidateIndex + 1 === this.taskAssignment.candidates.length;
    },
    isFirstAddedCandidate(volunteerId: string): boolean {
      const candidateIndex = this.taskAssignment.candidates.findIndex(
        (candidate) => candidate.volunteer.id === +volunteerId
      );
      return candidateIndex === 0;
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
      justify-content: space-around;
      width: 100%;
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

.candidate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  &-teams {
    min-width: $calendar-category-column-min-width;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    .not-selected {
      opacity: 0.4;
    }
  }
}
</style>
