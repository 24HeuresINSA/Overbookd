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
              <div class="calendar-header">
                <div class="calendar-header__action">
                  <v-btn
                    v-if="isRemovable(category)"
                    icon
                    color="red"
                    @click="removeLastCandidate()"
                  >
                    <v-icon>mdi-account-minus</v-icon>
                  </v-btn>
                </div>
                <div class="calendar-header__candidate">
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
                    class="volunteer-resume"
                  ></VolunteerResumeCalendarHeader>
                  <v-btn
                    v-if="isReplacable(category)"
                    icon
                    @click="nextCandidate"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
            <template #interval="{ hour, time, date, timeToY, category }">
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
              <div
                :class="{
                  available: isVolunteerAvailable(date, time, +category),
                }"
              />
            </template>
          </v-calendar>
          <div class="planning__teams">
            <div
              v-for="candidate in candidates"
              :key="candidate.volunteer.id"
              class="candidate-teams"
            >
              <TeamChip
                v-for="team of getAssignableTeams(candidate)"
                :key="team"
                :team="team"
                with-name
                size="large"
                :class="{
                  'not-selected': isNotAssignedAs(team, candidate),
                }"
                @click="temporaryAssign(team, candidate)"
              ></TeamChip>
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
            id="add-candidate"
            :class="{ invalid: canNotAssignMoreVolunteer }"
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
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
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
import { computeNextHourDate } from "~/utils/date/dateUtils";
import { isPeriodIncludedByAnother } from "~/utils/availabilities/availabilities";

export default Vue.extend({
  name: "AssignmentForm",
  components: {
    VolunteerResumeCalendarHeader,
    TeamChip,
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
      const id = this.taskAssignment.task.id;
      const name = this.taskAssignment.task.name;
      return `[${id}] ${name}`;
    },
    mainCandidate(): AssignmentCandidate | undefined {
      return this.taskAssignment.candidates.at(0);
    },
    start(): Date {
      return this.taskAssignment.task.start;
    },
    volunteerIds(): string[] {
      return this.taskAssignment.candidates.map((c) =>
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
      return !this.taskAssignment.canAssign;
    },
    canNotAssignMoreVolunteer(): boolean {
      return !this.taskAssignment.canAssignMoreVolunteer;
    },
    areOtherFriendsAvailable(): boolean {
      return this.taskAssignment.potentialCandidates.length > 0;
    },
    candidates(): AssignmentCandidate[] {
      return this.taskAssignment.candidates;
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
    isVolunteerAvailable(
      date: string,
      time: string,
      candidateId: number
    ): boolean {
      const candidate = this.taskAssignment.getCandidate(candidateId);
      if (!candidate) return false;

      const start = new Date(`${date} ${time}`);
      const end = computeNextHourDate(start);
      return candidate.availabilities.some(
        isPeriodIncludedByAnother({ start, end })
      );
    },
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
      if (this.canNotAssignMoreVolunteer) return;
      this.$accessor.assignment.addCandidate();
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
    isRemovable(volunteerId: string): boolean {
      return (
        this.isLastAddedCandidate(volunteerId) &&
        !this.isFirstAddedCandidate(volunteerId)
      );
    },
    removeLastCandidate(): void {
      this.$accessor.assignment.removeLastCandidate();
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
  gap: 25px;
  overflow-y: scroll;
  .planning {
    flex-grow: 9;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    padding-bottom: 80px;
    &__calendar {
      width: 100%;
      overflow-y: hidden;
    }
    &__teams {
      display: flex;
      justify-content: space-around;
      width: 100%;
    }
    &__assignment {
      position: fixed;
      right: calc(50% - 42px);
      bottom: calc(5% + 36px);
      @media only screen and(min-height: 1130px) {
        bottom: calc(50% - 465px);
      }
    }
  }
  .add-candidate-corridor {
    flex-grow: 1;
    padding: 10px;
  }
  .invalid {
    opacity: 0.3;
    cursor: initial;
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

.calendar-header {
  &__candidate {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    .volunteer-resume {
      width: 100%;
    }
  }

  &__action {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 36px;
  }
}

.candidate-teams {
  min-width: $calendar-category-column-min-width;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  .not-selected {
    opacity: 0.4;
  }
}

.available {
  background-color: $calendar-available-background-color;
  height: 100%;
  width: 100%;
}
</style>
