<template>
  <v-container class="assignment-container">
    <FilterableVolunteerList class="volunteer-list" />
    <TaskOrgaCalendar class="calendar" />
    <FilterableFtList class="task-list" />
    <v-dialog v-model="openTaskAssignmentDialog">
      <v-card>
        <v-card-title>{{ taskAssignmentTitle }}</v-card-title>
        <v-card-text>
          <div class="planning">
            <v-calendar
              ref="calendar"
              v-model="taskStart"
              type="category"
              category-show-all
              :categories="volunteerIds"
              :events="events"
              :interval-height="24"
            >
              <template #category="{ category }">
                <VolunteerResumeCalendarHeader
                  v-if="retrieveVolunteer(category)"
                  :volunteer="retrieveVolunteer(category)"
                ></VolunteerResumeCalendarHeader>
              </template>
            </v-calendar>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import FilterableVolunteerList from "~/components/organisms/assignment/FilterableVolunteerList.vue";
import { FtWithTimespan } from "~/utils/models/ftTimespan";
import FilterableFtList from "~/components/organisms/assignment/FilterableFtList.vue";
import TaskOrgaCalendar from "~/components/organisms/assignment/TaskOrgaCalendar.vue";
import VolunteerResumeCalendarHeader from "~/components/molecules/assignment/resume/VolunteerResumeCalendarHeader.vue";
import { Volunteer } from "~/utils/models/assignment";
import { getColorByStatus } from "~/domain/common/status-color";
import { TaskAssignment } from "~/domain/timespan-assignment/timespanAssignment";

export default Vue.extend({
  name: "TaskOrga",
  components: {
    FilterableVolunteerList,
    FilterableFtList,
    TaskOrgaCalendar,
    VolunteerResumeCalendarHeader,
  },
  computed: {
    ftWithTimespans(): FtWithTimespan[] {
      return this.$accessor.assignment.fts;
    },
    openTaskAssignmentDialog: {
      get(): boolean {
        return this.$accessor.assignment.openTaskAssignmentDialog;
      },
      set(): void {
        this.$accessor.assignment.resetAssignment();
      },
    },
    taskAssignment(): TaskAssignment {
      return this.$accessor.assignment.taskAssignment;
    },
    taskAssignmentTitle(): string {
      return this.$accessor.assignment.taskAssignment.task.name;
    },
    taskAssignmentVolunteer(): Volunteer | undefined {
      return this.$accessor.assignment.taskAssignment.candidates.at(0)
        ?.volunteer;
    },
    taskStart(): Date {
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
          const { start, end, name } =
            this.$accessor.assignment.taskAssignment.task;
          return [
            ...tasks.map(({ start, end, ft: { id, name, status } }) => ({
              start,
              end,
              category: volunteer.id.toString(),
              name: `[${id}] ${name}`,
              color: getColorByStatus(status),
              timed: true,
            })),
            {
              start,
              end,
              name,
              category: volunteer.id.toString(),
              timed: true,
            },
          ];
        }
      );
    },
  },
  async mounted() {
    this.$accessor.assignment.clearSelectedVariables();
    await this.$accessor.assignment.fetchFtsWithTimespans();
  },
  methods: {
    retrieveVolunteer(id: string): Volunteer | undefined {
      return this.taskAssignment.getCandidate(+id)?.volunteer;
    },
  },
});
</script>

<style lang="scss" scoped>
.assignment-container {
  width: 100%;
  height: 100%;
  max-width: 100vw;
  padding: 0;
  left: 0;
  top: 0;
  margin-left: 0;
  margin-right: 0;
  position: absolute;
  display: flex;
  justify-content: space-between;
}

.volunteer-list {
  max-width: 20%;
  height: 100%;
}

.calendar {
  width: 55%;
  height: calc(100% - 50px);
}

.task-list {
  max-width: 25%;
  height: 100%;
}
</style>
