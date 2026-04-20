import type {
  Assignment,
  AssignmentEvent,
  AssignmentIdentifier,
  BreakPeriod,
  TeamMember,
  VolunteerWithAssignmentDuration,
} from "@overbookd/assignment";
import type {
  AssignmentSummaryWithTask,
  HttpStringified,
} from "@overbookd/http";
import type { User } from "@overbookd/user";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { VolunteerToTaskRepository } from "~/repositories/assignment/volunteer-to-task.repository";
import { PlanningRepository } from "~/repositories/planning.repository";
import { UserRepository } from "~/repositories/user.repository";
import {
  type UnassignForm,
  castAssignmentWithDate,
} from "~/utils/assignment/assignment";
import { isHttpError } from "~/utils/http/http-error.utils";
import { castPeriodWithDate } from "~/utils/http/cast-date/period.utils";
import {
  castAssignmentEventsWithDate,
  castBreakPeriodWithDate,
} from "~/utils/http/cast-date/planning.utils";

type State = {
  volunteers: VolunteerWithAssignmentDuration[];
  selectedVolunteer: VolunteerWithAssignmentDuration | null;
  selectedVolunteerFriends: User[];
  assignments: AssignmentSummaryWithTask[];
  alreadyAssignedAssignments: AssignmentEvent[];
  breakPeriods: BreakPeriod[];
  hoverAssignment: AssignmentEvent | null;
  assignmentDetails: Assignment<{ withDetails: true }> | null;
};

export const useAssignVolunteerToTaskStore = defineStore(
  "assign-volunteer-to-task",
  {
    state: (): State => ({
      volunteers: [],
      selectedVolunteer: null,
      selectedVolunteerFriends: [],
      assignments: [],
      alreadyAssignedAssignments: [],
      breakPeriods: [],
      hoverAssignment: null,
      assignmentDetails: null,
    }),
    actions: {
      async fetchVolunteers() {
        const res = await VolunteerToTaskRepository.getVolunteers();
        if (isHttpError(res)) return;
        this.volunteers = res;
      },

      async selectVolunteer(volunteer: VolunteerWithAssignmentDuration) {
        this.selectedVolunteer = volunteer;

        const res = await UserRepository.getUserFriends(volunteer.id);
        if (isHttpError(res)) return;
        this.selectedVolunteerFriends = res;

        this.fetchPotentialAssignmentsFor(volunteer.id);
      },

      async fetchAllAssignmentsFor(volunteerId: number) {
        const res = await UserRepository.getVolunteerAssignments(volunteerId);
        if (isHttpError(res)) return;
        this.alreadyAssignedAssignments = castAssignmentEventsWithDate(res);
      },

      async fetchBreakPeriodsFor(volunteerId: number) {
        const res = await PlanningRepository.getBreakPeriods(volunteerId);
        if (isHttpError(res)) return;

        this.breakPeriods = res.map(castBreakPeriodWithDate);
      },

      async fetchPotentialAssignmentsFor(volunteerId: number) {
        const res =
          await VolunteerToTaskRepository.fetchPotentialAssignmentsFor(
            volunteerId,
          );
        if (isHttpError(res)) return;

        this.assignments = res.map(castAssignmentSummaryWithTaskWithDate);
      },

      async assign(assignment: AssignmentIdentifier, volunteer: TeamMember) {
        this.hoverAssignment = null;
        const repository = new AssignmentsRepository();
        const res = await repository.assign({
          assignment,
          volunteers: [volunteer],
        });
        if (isHttpError(res)) return;

        this.fetchVolunteers();
        this.fetchAllAssignmentsFor(volunteer.id);
        this.fetchPotentialAssignmentsFor(volunteer.id);
      },

      async unassign({ assignmentIdentifier, assigneeId }: UnassignForm) {
        const repository = new AssignmentsRepository();
        const res = await repository.unassign(assignmentIdentifier, assigneeId);
        if (isHttpError(res)) return;

        this.fetchVolunteers();
        this.fetchAssignmentDetails(assignmentIdentifier);
        if (!this.selectedVolunteer) return;
        this.fetchAllAssignmentsFor(this.selectedVolunteer.id);
        this.fetchPotentialAssignmentsFor(this.selectedVolunteer.id);
      },

      setHoverAssignment(assignment: AssignmentEvent | null) {
        this.hoverAssignment = assignment;
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
    },
  },
);

function castAssignmentSummaryWithTaskWithDate(
  assignment: HttpStringified<AssignmentSummaryWithTask>,
): AssignmentSummaryWithTask {
  return {
    ...assignment,
    ...castPeriodWithDate(assignment),
  };
}
