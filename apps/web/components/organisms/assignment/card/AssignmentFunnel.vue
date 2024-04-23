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
            :users="candidatesForCalendar"
            :planning-events="candidatesPlanningEvents"
            :event-to-add="assignmentAsEvent"
          >
            <template #volunteer-header="{ category }">
              <div class="calendar-header">
                <div class="calendar-header__action">
                  <v-btn
                    v-if="isRemovable(category)"
                    icon
                    color="red"
                    @click="removeLastCandidate"
                  >
                    <v-icon>mdi-account-minus</v-icon>
                  </v-btn>
                </div>
                <div class="calendar-header__candidate">
                  <v-btn
                    v-if="canChangeCandidates(category)"
                    icon
                    @click="previousCandidate"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <AssignmentVolunteerResumeCalendarHeader
                    v-if="retrieveVolunteer(category)"
                    :volunteer="retrieveVolunteer(category)"
                    class="volunteer-resume"
                  ></AssignmentVolunteerResumeCalendarHeader>
                  <v-btn
                    v-if="canChangeCandidates(category)"
                    icon
                    @click="nextCandidate"
                  >
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
                v-for="team of getAssignableTeams(candidate)"
                :key="team"
                :team="team"
                with-name
                show-hidden
                size="large"
                :class="{
                  'not-selected': isNotAssignedAs(team, candidate),
                }"
                @click="linkCandidateTeam(team, candidate)"
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
import {
  CalendarPlanningEvent,
  convertAssignmentPlanningEventForCalendar,
} from "~/domain/common/planning-events";
import { CalendarUser } from "~/utils/models/calendar.model";
import { getUnderlyingTeams } from "~/domain/timespan-assignment/underlying-teams";
import OverMultiCalendar from "~/components/molecules/calendar/OverMultiCalendar.vue";
import AssignmentVolunteerResumeCalendarHeader from "~/components/molecules/assignment/resume/AssignmentVolunteerResumeCalendarHeader.vue";
import {
  AssignableVolunteer,
  Assignment,
  PlanningEvent,
  VolunteersForAssignment,
} from "@overbookd/assignment";
import { removeItemAtIndex, updateItemToList } from "@overbookd/list";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { IProvidePeriod } from "@overbookd/period";

type Candidate = AssignableVolunteer & {
  as?: string;
};

export type CandidateForCalendar = Candidate & {
  availabilities: IProvidePeriod[];
  events: PlanningEvent[];
};

type AssingmentFunnelData = {
  calendarDate: Date;
  candidates: CandidateForCalendar[];
  selectedFriendIndex: number;
};

export default defineComponent({
  name: "AssignmentFunnel",
  components: {
    OverMultiCalendar,
    AssignmentVolunteerResumeCalendarHeader,
    TeamChip,
  },
  props: {
    volunteer: {
      type: Object as () => AssignableVolunteer,
      required: true,
    },
    assignment: {
      type: Object as () => Assignment,
      required: true,
    },
  },
  emits: ["close-dialog", "volunteers-assigned"],
  data: (): AssingmentFunnelData => {
    return {
      calendarDate: new Date(),
      candidates: [],
      selectedFriendIndex: 0,
    };
  },
  computed: {
    selectedVolunteer(): Candidate | null {
      return this.$accessor.assignTaskToVolunteer.selectedVolunteer;
    },
    assignableVolunteers(): Candidate[] {
      return this.$accessor.assignTaskToVolunteer.assignableVolunteers;
    },
    lockedCandidates(): Candidate[] {
      if (this.candidates.length <= 1) return this.candidates;
      return [
        ...removeItemAtIndex(this.candidates, this.candidates.length - 1),
      ];
    },
    assignableFriends(): Candidate[] {
      const candidatesriendsIds = [
        ...new Set(
          this.lockedCandidates.flatMap(
            ({ assignableFriendsIds }) => assignableFriendsIds,
          ),
        ),
      ].filter((id) => !this.candidates.map(({ id }) => id).includes(id));

      return this.assignableVolunteers.filter((volunteer) =>
        candidatesriendsIds.includes(volunteer.id),
      );
    },
    selectedAssignment(): Assignment | null {
      return this.$accessor.assignTaskToVolunteer.selectedAssignment;
    },
    taskTitle(): string {
      const { taskId, name } = this.assignment;
      return `[${taskId}] ${name}`;
    },
    candidatesForCalendar(): CalendarUser[] {
      return this.candidates.map((candidate: CandidateForCalendar) => ({
        id: candidate.id,
        firstname: candidate.firstname,
        lastname: candidate.lastname,
        teams: candidate.teams,
        availabilities: candidate.availabilities,
      }));
    },
    candidatesPlanningEvents(): CalendarPlanningEvent[] {
      return this.candidates.flatMap(({ events, id }: CandidateForCalendar) =>
        events.map((event) =>
          convertAssignmentPlanningEventForCalendar(event, id),
        ),
      );
    },
    assignmentAsEvent(): CalendarPlanningEvent {
      const { start, end, name } = this.assignment;
      return { start, end, name };
    },
    canNotAssign(): boolean {
      return this.candidates.some((candidate) => !candidate.as);
    },
    canNotAssignMoreVolunteer(): boolean {
      if (!this.selectedAssignment) return true;
      if (this.assignableFriends.length === 0 || this.canNotAssign) return true;
      const demands = this.selectedAssignment.demands.reduce(
        (acc, demand) => acc + demand.demand,
        0,
      );
      const assigneeCount = this.selectedAssignment.assignees.filter(
        (assignee) =>
          !Object.hasOwn(assignee, "as") ||
          ("as" in assignee && assignee.as !== null),
      ).length;
      return demands <= this.candidates.length + assigneeCount;
    },
  },
  watch: {
    assignment({ start }: Assignment) {
      this.calendarDate = start;
    },
    selectedVolunteer() {
      this.clearData();
      this.initCandidates();
    },
  },
  mounted() {
    this.calendarDate = this.assignment.start;
    this.initCandidates();
  },
  methods: {
    async initCandidates() {
      if (!this.selectedVolunteer) return;

      const newCandidate = await this.convertCandidateForCalendar(
        this.selectedVolunteer,
      );
      this.candidates = [newCandidate];

      const assignableTeams = this.getAssignableTeams(this.selectedVolunteer);
      if (assignableTeams.length === 1) {
        this.linkCandidateTeam(assignableTeams[0], this.candidates[0]);
      }
    },
    async convertCandidateForCalendar(
      candidate: Candidate,
    ): Promise<CandidateForCalendar> {
      const events =
        await this.$accessor.assignTaskToVolunteer.getPlanningEvents(
          candidate.id,
        );
      const availabilities =
        await this.$accessor.assignTaskToVolunteer.getAvailabilities(
          candidate.id,
        );
      return {
        ...candidate,
        events,
        availabilities,
      };
    },
    canChangeCandidates(id: string): boolean {
      return this.isLastAddedCandidate(id) && this.assignableFriends.length > 1;
    },
    retrieveVolunteer(id: string): Candidate | undefined {
      return this.candidates.find((candidate) => candidate.id === +id);
    },
    clearData() {
      this.candidates = [];
      this.selectedFriendIndex = 0;
    },
    closeDialog() {
      this.clearData();
      this.$emit("close-dialog");
    },
    linkCandidateTeam(teamCode: string, candidate?: Candidate) {
      const isLastCandidate =
        this.candidates.findIndex(({ id }) => id === candidate?.id) ===
        this.candidates.length - 1;
      if (!isLastCandidate) return;

      this.candidates = updateItemToList(
        this.candidates,
        this.candidates.length - 1,
        { ...this.candidates[this.candidates.length - 1], as: teamCode },
      );
    },
    getAssignableTeams(candidate?: Candidate): string[] {
      if (!candidate) return [];
      const underlyingTeams = getUnderlyingTeams(candidate.teams);
      const teams = [...candidate.teams, ...underlyingTeams];
      const demands =
        this.selectedAssignment?.demands.flatMap(({ team }) => team) ?? [];
      return demands.filter((team) => teams.includes(team));
    },
    isNotAssignedAs(teamCode: string, candidate?: Candidate): boolean {
      if (!candidate) return false;
      return candidate.as !== teamCode;
    },
    assign() {
      if (this.canNotAssign) return;

      const assignment = {
        assignmentId: this.assignment.assignmentId,
        mobilizationId: this.assignment.mobilizationId,
        taskId: this.assignment.taskId,
      };
      const volunteers = this.candidates.map(({ id, as }) => ({ id, as }));
      this.$accessor.assignTaskToVolunteer.assign({
        assignment,
        volunteers,
      } as VolunteersForAssignment);

      this.$emit("volunteers-assigned", assignment);
      this.closeDialog();
    },
    async addCandidate() {
      if (this.canNotAssignMoreVolunteer) return;
      this.selectedFriendIndex = 0;

      const newCandidate = await this.convertCandidateForCalendar(
        this.assignableFriends[this.selectedFriendIndex],
      );
      this.candidates = [...this.candidates, newCandidate];

      const assignableTeams = this.getAssignableTeams(
        this.assignableFriends[this.selectedFriendIndex],
      );
      if (assignableTeams.length === 1) {
        this.linkCandidateTeam(assignableTeams[0], newCandidate);
      }
    },
    async previousCandidate() {
      this.selectedFriendIndex =
        (this.selectedFriendIndex - 1 + this.assignableFriends.length) %
        this.assignableFriends.length;

      const newCandidate = await this.convertCandidateForCalendar(
        this.assignableFriends[this.selectedFriendIndex],
      );

      this.candidates = updateItemToList(
        this.candidates,
        this.candidates.length - 1,
        newCandidate,
      );

      const assignableTeams = this.getAssignableTeams(
        this.assignableFriends[this.selectedFriendIndex],
      );
      if (assignableTeams.length === 1) {
        this.linkCandidateTeam(assignableTeams[0], newCandidate);
      }
    },
    async nextCandidate() {
      this.selectedFriendIndex =
        (this.selectedFriendIndex + 1) % this.assignableFriends.length;

      const newCandidate = await this.convertCandidateForCalendar(
        this.assignableFriends[this.selectedFriendIndex],
      );

      this.candidates = updateItemToList(
        this.candidates,
        this.candidates.length - 1,
        newCandidate,
      );

      const assignableTeams = this.getAssignableTeams(
        this.assignableFriends[this.selectedFriendIndex],
      );
      if (assignableTeams.length === 1) {
        this.linkCandidateTeam(assignableTeams[0], newCandidate);
      }
    },
    isLastAddedCandidate(volunteerId: string): boolean {
      if (this.candidatesForCalendar.length < 2) return false;
      return (
        this.candidatesForCalendar[this.candidatesForCalendar.length - 1].id ===
        +volunteerId
      );
    },
    isFirstAddedCandidate(volunteerId: string): boolean {
      return this.selectedVolunteer?.id === +volunteerId;
    },
    isRemovable(volunteerId: string): boolean {
      return (
        this.isLastAddedCandidate(volunteerId) &&
        !this.isFirstAddedCandidate(volunteerId)
      );
    },
    removeLastCandidate(): void {
      this.candidates.pop();
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
