import type {
  AssignableVolunteer,
  Assignment,
  AssignmentIdentifier,
  TaskForAssignment,
  PlanningEvent,
  TaskWithAssignmentsSummary,
  VolunteersForAssignment,
} from "@overbookd/assignment";
import { TaskToVolunteerRepository } from "~/repositories/assignment/task-to-volunteer.repository";
import type { HttpStringified } from "@overbookd/http";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { castPeriodWithDate } from "~/utils/http/cast-date/period.utils";
import type { IProvidePeriod } from "@overbookd/time";
import { AvailabilitiesRepository } from "~/repositories/assignment/availabilities.repository";
import {
  type UnassignForm,
  castAssignmentWithDate,
} from "~/utils/assignment/assignment";
import { isHttpError } from "~/utils/http/http-error.utils";
import { AssignmentPlanningRepository } from "~/repositories/assignment/planning.repository";

type State = {
  tasks: {
    all: TaskForAssignment[];
    toAssign: TaskForAssignment[];
  };
  selectedTask: TaskWithAssignmentsSummary | null;
  selectedAssignment: Assignment | null;
  assignableVolunteers: AssignableVolunteer[];
  selectedVolunteer: AssignableVolunteer | null;
  assignmentDetails: Assignment<{ withDetails: true }> | null;
};

export const useAssignTaskToVolunteerStore = defineStore(
  "assign-task-to-volunteer",
  {
    state: (): State => ({
      tasks: { all: [], toAssign: [] },
      selectedTask: null,
      selectedAssignment: null,
      assignableVolunteers: [],
      selectedVolunteer: null,
      assignmentDetails: null,
    }),
    actions: {
      async fetchAssignableTasks() {
        const res = await TaskToVolunteerRepository.getAssignableTasks();
        if (isHttpError(res)) return;
        this.tasks.toAssign = res;
      },

      async fetchAllTasks() {
        const res = await TaskToVolunteerRepository.getAllTasks();
        if (isHttpError(res)) return;
        this.tasks.all = res;
      },

      async selectTask(taskId: number) {
        const res = await TaskToVolunteerRepository.selectTask(taskId);
        if (isHttpError(res)) return;

        const task = castTaskWithAssignmentsSummaryWithDate(res);
        this.selectedTask = task;
        this.selectedAssignment = null;
        this.selectedVolunteer = null;
        this.assignableVolunteers = [];
      },

      async selectAssignment(assignmentIdentifier: AssignmentIdentifier) {
        const [assignableVolunteersRes, assignmentRes] = await Promise.all([
          TaskToVolunteerRepository.getAssignableVolunteersForAssignment(
            assignmentIdentifier,
          ),
          AssignmentsRepository.findOne(assignmentIdentifier),
        ]);
        if (isHttpError(assignableVolunteersRes) || isHttpError(assignmentRes))
          return;
        this.assignableVolunteers = assignableVolunteersRes;
        this.selectedAssignment = castAssignmentWithDate(assignmentRes);
      },

      selectVolunteer(volunteer: AssignableVolunteer) {
        this.selectedVolunteer = volunteer;
      },

      async fetchAssignmentDetails(assignmentIdentifier: AssignmentIdentifier) {
        type AssignmentWithDetails = Assignment<{ withDetails: true }>;
        const res = await AssignmentsRepository.findOne<AssignmentWithDetails>(
          assignmentIdentifier,
          true,
        );
        if (isHttpError(res)) return;
        this.assignmentDetails = castAssignmentWithDate(res);
      },

      async assign(volunteersForAssignment: VolunteersForAssignment) {
        const repository = new AssignmentsRepository();
        await repository.assign(volunteersForAssignment);
        this.selectTask(volunteersForAssignment.assignment.taskId);
      },

      async unassign({ assignmentIdentifier, assigneeId }: UnassignForm) {
        const repository = new AssignmentsRepository();
        await repository.unassign(assignmentIdentifier, assigneeId);

        this.fetchAssignmentDetails(assignmentIdentifier);
        this.selectTask(assignmentIdentifier.taskId);
      },

      async getPlanningEvents(volunteerId: number): Promise<PlanningEvent[]> {
        const repository = new AssignmentPlanningRepository();
        return repository.for(volunteerId);
      },

      async getAvailabilities(volunteerId: number): Promise<IProvidePeriod[]> {
        const repository = new AvailabilitiesRepository();
        const availabilities = await repository.for(volunteerId);
        return availabilities.map(({ start, end }) => ({
          start: new Date(start),
          end: new Date(end),
        }));
      },
    },
  },
);

function castTaskWithAssignmentsSummaryWithDate(
  task: HttpStringified<TaskWithAssignmentsSummary>,
): TaskWithAssignmentsSummary {
  return {
    ...task,
    assignments: task.assignments.map((assignment) => ({
      ...assignment,
      ...castPeriodWithDate(assignment),
    })),
  };
}
