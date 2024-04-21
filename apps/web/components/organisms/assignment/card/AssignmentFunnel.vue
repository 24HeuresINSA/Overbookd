<template>
  <v-card>
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title>{{ taskTitle }}</v-card-title>
    <v-card-text>
      <div class="planning-list">
        <div class="planning">
          <OverMultiCalendar
            v-model="calendarDate"
            :users="volunteerAvailabilitiesForCalendar"
            :planning-events="candidatesPlanningEvents"
            :event-to-add="assignmentAsEvent"
          >
            <template #volunteer-header="{}">
              <div class="calendar-header">
                <div class="calendar-header__action">
                  <v-btn
                    v-if="false"
                    icon
                    color="red"
                    @click="removeLastCandidate"
                  >
                    <v-icon>mdi-account-minus</v-icon>
                  </v-btn>
                </div>
                <div class="calendar-header__candidate">
                  <v-btn v-if="false" icon @click="previousCandidate">
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <AssignmentVolunteerResumeCalendarHeader
                    v-if="volunteer"
                    :volunteer="volunteer"
                    class="volunteer-resume"
                  ></AssignmentVolunteerResumeCalendarHeader>
                  <v-btn v-if="false" icon @click="nextCandidate">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
          </OverMultiCalendar>
          <div class="planning__teams">
            <div
              v-for="candidate in candidates"
              :key="candidate.id"
              class="candidate-teams"
            >
              <TeamChip
                v-for="team of candidate.assignableTeams"
                :key="team"
                :team="team"
                with-name
                show-hidden
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
import { defineComponent } from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import {
  AssignmentCandidate,
  Task,
  TaskAssignment,
} from "~/domain/timespan-assignment/timeSpanAssignment";
import {
  CalendarPlanningEvent,
  convertAssignmentPlanningEventForCalendar,
} from "~/domain/common/planning-events";
import { Volunteer } from "~/utils/models/assignment.model";
import { CalendarUser } from "~/utils/models/calendar.model";
import { getUnderlyingTeams } from "~/domain/timespan-assignment/underlying-teams";
import OverMultiCalendar from "~/components/molecules/calendar/OverMultiCalendar.vue";
import AssignmentVolunteerResumeCalendarHeader from "~/components/molecules/assignment/resume/AssignmentVolunteerResumeCalendarHeader.vue";
import {
  Assignment,
  AssignmentVolunteer,
  EveryCandidateFulfillsDemand,
  IDefineCandidate,
  ReadyToStart,
  SomeCandidatesNotFulfillingDemand,
} from "@overbookd/assignment";
import { assignments, candidateFactory } from "~/utils/assignment/funnel";

type AssignmentAndVolunteerSelected =
  | SomeCandidatesNotFulfillingDemand
  | EveryCandidateFulfillsDemand;

type AssingmentFunneData = {
  calendarDate: Date;
  funnel: AssignmentAndVolunteerSelected | null;
};

export default defineComponent({
  name: "AssignmentFunnel",
  components: {
    TeamChip,
    OverMultiCalendar,
    AssignmentVolunteerResumeCalendarHeader,
  },
  props: {
    volunteer: {
      type: Object as () => AssignmentVolunteer,
      required: true,
    },
    assignment: {
      type: Object as () => Assignment,
      required: true,
    },
  },
  data: (): AssingmentFunneData => {
    return {
      calendarDate: new Date(),
      funnel: null,
    };
  },
  computed: {
    taskAssignment(): TaskAssignment {
      return this.$accessor.assignment.taskAssignment;
    },
    taskTitle(): string {
      const { taskId, name } = this.assignment;
      return `[${taskId}] ${name}`;
    },
    mainCandidate(): AssignmentCandidate | undefined {
      return this.taskAssignment.candidates.at(0);
    },
    volunteerIds(): string[] {
      return this.taskAssignment.candidates.map((c) =>
        c.volunteer.id.toString(),
      );
    },
    currentTask(): Task {
      return this.taskAssignment.task;
    },
    volunteerAvailabilitiesForCalendar(): CalendarUser[] {
      if (!this.funnel) return [];
      if (
        !(this.funnel instanceof SomeCandidatesNotFulfillingDemand) &&
        !(this.funnel instanceof EveryCandidateFulfillsDemand)
      ) {
        return [];
      }
      return this.funnel.candidates.map((candidate: IDefineCandidate) => ({
        id: candidate.id,
        firstname: candidate.firstname,
        lastname: candidate.lastname,
        teams: candidate.teams,
        availabilities: [], // TODO Get assigment somehow
      }));
    },
    candidatesPlanningEvents(): CalendarPlanningEvent[] {
      if (!this.funnel) return [];
      return this.funnel.candidates.flatMap(
        ({ planning, id }: IDefineCandidate) =>
          planning.map((planning) =>
            convertAssignmentPlanningEventForCalendar(planning, id),
          ),
      );
    },
    assignmentAsEvent(): CalendarPlanningEvent {
      const { start, end, name } = this.assignment;
      return { start, end, name };
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
    candidates(): IDefineCandidate[] {
      return this.funnel?.candidates ?? [];
    },
  },
  watch: {
    assignment({ start }: Assignment) {
      this.calendarDate = start;
    },
    async volunteer() {
      this.funnel = await this.initFunnel();
    },
  },
  async mounted() {
    this.calendarDate = this.assignment.start;
    this.funnel = await this.initFunnel();
  },
  methods: {
    initFunnel(): Promise<AssignmentAndVolunteerSelected> {
      return ReadyToStart.init(candidateFactory(this), assignments(this))
        .select(this.assignment)
        .select(this.volunteer);
    },
    retrieveVolunteer(id: string): Volunteer | undefined {
      return this.taskAssignment.getCandidate(+id)?.volunteer;
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    getAssignableTeams(candidate?: AssignmentCandidate): string[] {
      if (!candidate) return [];
      const underlyingTeams = getUnderlyingTeams(candidate.volunteer.teams);
      const teams = [...candidate.volunteer.teams, ...underlyingTeams];
      return teams.filter((team) =>
        this.taskAssignment.remainingTeamRequest.includes(team),
      );
    },
    temporaryAssign(team: string, candidate?: IDefineCandidate) {
      if (!candidate) return;
      if (this.funnel instanceof SomeCandidatesNotFulfillingDemand) {
        this.funnel.fulfillDemand({ volunteer: candidate.id, team });
      }
    },
    isNotAssignedAs(teamCode: string, candidate?: IDefineCandidate): boolean {
      if (!candidate) return false;
      return candidate.as !== teamCode;
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
        (candidate) => candidate.volunteer.id === +volunteerId,
      );
      return candidateIndex + 1 === this.taskAssignment.candidates.length;
    },
    isFirstAddedCandidate(volunteerId: string): boolean {
      const candidateIndex = this.taskAssignment.candidates.findIndex(
        (candidate) => candidate.volunteer.id === +volunteerId,
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
    max-width: 200px;
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
  padding-left: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  .not-selected {
    opacity: 0.4;
  }
}
</style>
