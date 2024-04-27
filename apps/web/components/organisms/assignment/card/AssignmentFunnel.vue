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
              <CandidateHeader
                v-if="retrieveVolunteer(category) && funnel"
                :funnel="funnel"
                :candidate="candidatesByStringifiedIds[category]"
                @revoke="revokeLastCandidate"
                @next="nextCandidate"
                @previous="previousCandidate"
              />
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
import { TaskAssignment } from "~/domain/timespan-assignment/timeSpanAssignment";
import {
  CalendarPlanningEvent,
  convertAssignmentPlanningEventForCalendar,
  convertToCalendarBreak,
} from "~/domain/common/planning-events";
import { CalendarUser } from "~/utils/models/calendar.model";
import OverMultiCalendar from "~/components/molecules/calendar/OverMultiCalendar.vue";
import {
  Assignment,
  AssignableVolunteer,
  IDefineCandidate,
  IActAsFunnel,
  ReadyToStart,
} from "@overbookd/assignment";
import { assignments, candidateFactory } from "~/utils/assignment/funnel";
import CandidateHeader from "~/components/molecules/assignment/calendar/CandidateHeader.vue";

type AssingmentFunnelData = {
  calendarDate: Date;
  funnel: IActAsFunnel | null;
  candidatesByStringifiedIds: Record<string, IDefineCandidate>;
};

export default defineComponent({
  name: "AssignmentFunnel",
  components: {
    TeamChip,
    OverMultiCalendar,
    CandidateHeader,
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
      funnel: null,
      candidatesByStringifiedIds: {},
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
    candidatesForCalendar(): CalendarUser[] {
      if (!this.funnel) return [];
      return this.funnel.candidates.map((candidate: IDefineCandidate) => ({
        id: candidate.id,
        firstname: candidate.firstname,
        lastname: candidate.lastname,
        teams: candidate.teams,
        availabilities: candidate.availabilities,
      }));
    },
    candidatesPlanningEvents(): CalendarPlanningEvent[] {
      if (!this.funnel) return [];
      const tasks = this.funnel.candidates.flatMap(
        ({ planning, id }: IDefineCandidate) =>
          planning.map((event) =>
            convertAssignmentPlanningEventForCalendar(event, id),
          ),
      );
      const breaks = this.funnel.candidates.flatMap(({ id, breakPeriods }) =>
        breakPeriods.map((breakPeriod) => ({
          ...convertToCalendarBreak(breakPeriod),
          volunteerId: id,
        })),
      );
      return [...tasks, ...breaks];
    },
    assignmentAsEvent(): CalendarPlanningEvent {
      const { start, end, name } = this.assignment;
      return { start, end, name };
    },
    canNotAssign(): boolean {
      if (!this.funnel) return true;
      return !this.funnel.canAssign;
    },
    canNotAssignMoreVolunteer(): boolean {
      return !this.funnel?.canFulfillMoreRemainingDemands ?? true;
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
    addEventListener("keydown", (event) => {
      if (["=", "+"].includes(event.key)) this.addCandidate();
      if (["Backspace", "Delete"].includes(event.key))
        this.revokeLastCandidate();
      if (["Enter"].includes(event.key)) this.assign();
      if (["j"].includes(event.key)) this.previousCandidate();
      if (["l"].includes(event.key)) this.nextCandidate();
    });
  },
  methods: {
    initFunnel(): Promise<IActAsFunnel> {
      return ReadyToStart.init(candidateFactory(this), assignments(this))
        .select(this.assignment)
        .select(this.volunteer);
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    temporaryAssign(team: string, candidate: IDefineCandidate) {
      if (!this.funnel) return;

      this.funnel = this.funnel?.fulfillDemand({
        volunteer: candidate.id,
        team,
      });
    },
    isNotAssignedAs(teamCode: string, candidate: IDefineCandidate): boolean {
      return candidate.as !== teamCode;
    },
    canChangeCandidates(id: string): boolean {
      const canChange = this.funnel?.canChangeLastCandidate ?? false;
      return this.isLastAddedCandidate(id) && canChange;
    },
    retrieveVolunteer(id: string): boolean {
      const storedIds = Object.keys(this.candidatesByStringifiedIds);
      const isAlreadyStored = storedIds.includes(id);
      if (isAlreadyStored) return true;

      const candidate = this.funnel?.candidates.find(
        (candidate) => candidate.id === +id,
      );
      if (!candidate) return false;

      this.candidatesByStringifiedIds = {
        ...this.candidatesByStringifiedIds,
        [id]: candidate,
      };
      return true;
    },
    async assign() {
      if (this.canNotAssign) return;
      if (!this.funnel) return;
      await this.funnel.assign();
      this.$emit("volunteers-assigned", this.assignment);
      this.closeDialog();
    },
    async addCandidate() {
      if (!this.funnel?.canFulfillMoreRemainingDemands) return;
      this.funnel = await this.funnel.addCandidate();
    },
    async previousCandidate() {
      if (!this.funnel?.canChangeLastCandidate) return;
      this.funnel = await this.funnel.previousCandidate();
    },
    async nextCandidate() {
      if (!this.funnel?.canChangeLastCandidate) return;
      this.funnel = await this.funnel.nextCandidate();
    },
    isLastAddedCandidate(volunteerId: string): boolean {
      const lastCandidate = this.candidates.at(-1);
      return lastCandidate?.id === +volunteerId;
    },
    isFirstAddedCandidate(volunteerId: string): boolean {
      const candidateIndex = this.taskAssignment.candidates.findIndex(
        (candidate) => candidate.volunteer.id === +volunteerId,
      );
      return candidateIndex === 0;
    },
    isRemovable(volunteerId: string): boolean {
      const canRevoke = this.funnel?.canRevokeLastCandidate ?? false;
      return this.isLastAddedCandidate(volunteerId) && canRevoke;
    },
    revokeLastCandidate(): void {
      if (!this.funnel?.canRevokeLastCandidate) return;
      this.funnel = this.funnel.revokeLastCandidate();
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
      justify-content: center;
      width: 100%;
      padding-left: 60px;
      gap: 10px;
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

.candidate-teams {
  max-width: 190px;
  min-width: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  .not-selected {
    opacity: 0.4;
  }
  :hover {
    cursor: pointer;
  }
}
</style>
