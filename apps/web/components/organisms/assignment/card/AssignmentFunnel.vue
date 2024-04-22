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
              <!--
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
              -->
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
import { CalendarPlanningEvent } from "~/domain/common/planning-events";
import { CalendarUser } from "~/utils/models/calendar.model";
import { getUnderlyingTeams } from "~/domain/timespan-assignment/underlying-teams";
import OverMultiCalendar from "~/components/molecules/calendar/OverMultiCalendar.vue";
import AssignmentVolunteerResumeCalendarHeader from "~/components/molecules/assignment/resume/AssignmentVolunteerResumeCalendarHeader.vue";
import { AssignableVolunteer, Assignment } from "@overbookd/assignment";
import { removeItemAtIndex, updateItemToList } from "@overbookd/list";

type Candidate = AssignableVolunteer & {
  as?: string;
};

type AssingmentFunneData = {
  calendarDate: Date;
  additionalCandidates: Candidate[];
  selectedFriendIndex: number;
};

export default defineComponent({
  name: "AssignmentFunnel",
  components: {
    OverMultiCalendar,
    AssignmentVolunteerResumeCalendarHeader,
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
  data: (): AssingmentFunneData => {
    return {
      calendarDate: new Date(),
      additionalCandidates: [],
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
      if (this.candidates.length === 1) return this.candidates;
      return [
        ...removeItemAtIndex(this.candidates, this.candidates.length - 1),
      ];
    },
    assignableFriends(): Candidate[] {
      // ATTENTION, je crois qu'il y a un problème d'actualisation avec lockedCandidate
      // Quand on add un candidate, ça prend en compte que les amis du 1er
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
    candidates(): Candidate[] {
      if (this.selectedVolunteer === null) return [];
      return [this.selectedVolunteer, ...this.additionalCandidates];
    },
    taskTitle(): string {
      const { taskId, name } = this.assignment;
      return `[${taskId}] ${name}`;
    },
    candidatesForCalendar(): CalendarUser[] {
      return this.candidates.map((candidate: Candidate) => ({
        id: candidate.id,
        firstname: candidate.firstname,
        lastname: candidate.lastname,
        teams: candidate.teams,
        availabilities: [],
      }));
    },
    candidatesPlanningEvents(): CalendarPlanningEvent[] {
      return [];
    },
    assignmentAsEvent(): CalendarPlanningEvent {
      const { start, end, name } = this.assignment;
      return { start, end, name };
    },
    canNotAssign(): boolean {
      return this.candidates.every((candidate) => !candidate.as);
    },
    canNotAssignMoreVolunteer(): boolean {
      if (!this.selectedAssignment) return true;
      if (this.assignableFriends.length === 0) return true;
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
    },
  },
  async mounted() {
    this.calendarDate = this.assignment.start;
  },
  methods: {
    canChangeCandidates(id: string): boolean {
      return this.isLastAddedCandidate(id) && this.assignableFriends.length > 1;
    },
    retrieveVolunteer(id: string): Candidate | undefined {
      return this.candidates.find((candidate) => candidate.id === +id);
    },
    clearData() {
      this.additionalCandidates = [];
      this.selectedFriendIndex = 0;
    },
    closeDialog() {
      this.clearData();
      this.$emit("close-dialog");
    },
    getAssignableTeams(candidate?: Candidate): string[] {
      if (!candidate) return [];
      const underlyingTeams = getUnderlyingTeams(candidate.teams);
      const teams = [...candidate.teams, ...underlyingTeams];
      return [];
      /*return teams.filter((team) =>
        this.taskAssignment.remainingTeamRequest.includes(team),
      );*/
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
    addCandidate() {
      if (this.canNotAssignMoreVolunteer) return;
      this.selectedFriendIndex = 0;
      this.additionalCandidates = [
        ...this.additionalCandidates,
        this.assignableFriends[this.selectedFriendIndex],
      ];
    },
    previousCandidate() {
      this.selectedFriendIndex =
        (this.selectedFriendIndex - 1 + this.assignableFriends.length) %
        this.assignableFriends.length;

      this.additionalCandidates = updateItemToList(
        this.additionalCandidates,
        this.additionalCandidates.length - 1,
        this.assignableFriends[this.selectedFriendIndex],
      );
    },
    nextCandidate() {
      this.selectedFriendIndex =
        (this.selectedFriendIndex + 1) % this.assignableFriends.length;

      this.additionalCandidates = updateItemToList(
        this.additionalCandidates,
        this.additionalCandidates.length - 1,
        this.assignableFriends[this.selectedFriendIndex],
      );
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
      this.additionalCandidates.pop();
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
