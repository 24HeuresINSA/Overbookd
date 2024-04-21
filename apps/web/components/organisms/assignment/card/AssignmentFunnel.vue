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
            :users="calendarUsers"
            :planning-events="candidatesTaskEvents"
            :event-to-add="currentTaskAsEvent"
          >
            <template #volunteer-header="{}">
              <div class="calendar-header">
                <div class="calendar-header__action">
                  <v-btn
                    v-if="isRemovable()"
                    icon
                    color="red"
                    @click="removeLastCandidate()"
                  >
                    <v-icon>mdi-account-minus</v-icon>
                  </v-btn>
                </div>
                <div class="calendar-header__candidate">
                  <v-btn v-if="isReplacable()" icon @click="previousCandidate">
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <AssignmentVolunteerResumeCalendarHeader
                    v-if="retrieveVolunteer()"
                    :volunteer="retrieveVolunteer()"
                    class="volunteer-resume"
                  ></AssignmentVolunteerResumeCalendarHeader>
                  <v-btn v-if="isReplacable()" icon @click="nextCandidate">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
          </OverMultiCalendar>
          <div class="planning__teams">
            <div
              v-for="candidate in candidates"
              :key="candidate.json.id"
              class="candidate-teams"
            >
              <TeamChip
                v-for="team of candidate.json.assignableTeams"
                :key="team"
                :team="team"
                with-name
                size="large"
                :class="{
                  'not-selected': team !== candidate.json.as,
                }"
                @click="candidate.demandAs(team)"
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
  Assignment,
  VolunteerForFunnel,
  Candidate,
  Funnel,
  ReadyToStart,
} from "@overbookd/assignment";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import {
  PlanningEvent,
  convertTaskToPlanningEvent,
  createTemporaryTaskPlanningEvent,
} from "~/domain/common/planning-events";
import { Volunteer } from "~/utils/models/assignment.model";
import { CalendarUser } from "~/utils/models/calendar.model";
import OverMultiCalendar from "~/components/molecules/calendar/OverMultiCalendar.vue";
import AssignmentVolunteerResumeCalendarHeader from "~/components/molecules/assignment/resume/AssignmentVolunteerResumeCalendarHeader.vue";
import { assignments, candidateFactory } from "~/utils/assignment/funnel";

type AssignmentFunnelData = {
  calendarDate: Date;
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
      type: Object as () => VolunteerForFunnel,
      required: true,
    },
    assignment: {
      type: Object as () => Assignment,
      required: true,
    },
  },
  data: (): AssignmentFunnelData => {
    return {
      calendarDate: new Date(),
    };
  },
  computed: {
    taskAssignment(): Assignment {
      return this.assignment;
    },
    funnel(): Funnel {
      const { funnel } = this.$accessor.assignTaskToVolunteer;
      const baseFunnel = ReadyToStart.init(
        candidateFactory(this),
        assignments(this),
      );
      return funnel ?? baseFunnel;
    },
    taskId(): number {
      return this.assignment.taskId;
    },
    taskTitle(): string {
      return `[${this.assignment.taskId}] ${this.assignment.name}`;
    },
    start(): Date {
      return this.assignment.start;
    },
    calendarUsers(): CalendarUser[] {
      return [];
    },
    candidatesTaskEvents(): PlanningEvent[] {
      return this.$accessor.assignment.taskAssignment.candidates.flatMap(
        ({ volunteer, tasks }) =>
          tasks.map((task) => convertTaskToPlanningEvent(task, volunteer.id)),
      );
    },
    currentTaskAsEvent(): PlanningEvent {
      return createTemporaryTaskPlanningEvent(this.assignment);
    },
    canNotAssign(): boolean {
      return true;
    },
    canNotAssignMoreVolunteer(): boolean {
      return true;
    },
    areOtherFriendsAvailable(): boolean {
      return false;
    },
    candidates(): Candidate[] {
      return [];
    },
  },
  watch: {
    assignment(assignment) {
      this.calendarDate = assignment.start;
    },
  },
  async mounted() {
    this.calendarDate = this.assignment.start;
  },
  methods: {
    retrieveVolunteer(): Volunteer | undefined {
      return undefined;
    },
    closeDialog() {
      this.$emit("close-dialog");
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
    isReplacable(): boolean {
      return (
        this.isLastAddedCandidate() &&
        this.areOtherFriendsAvailable &&
        !this.isFirstAddedCandidate()
      );
    },
    isLastAddedCandidate(): boolean {
      return false;
    },
    isFirstAddedCandidate(): boolean {
      return true;
    },
    isRemovable(): boolean {
      return this.isLastAddedCandidate() && !this.isFirstAddedCandidate();
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
</style>
