import type {
  Assignment,
  AssignmentEvent,
  AssignmentIdentifier,
  TeamMember,
  VolunteerWithAssignmentDuration,
} from "@overbookd/assignment";
import type {
  AssignmentSummaryWithTask,
  AssignmentFriend,
  HttpStringified,
} from "@overbookd/http";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { VolunteerToTaskRepository } from "~/repositories/assignment/volunteer-to-task.repository";
import { UserRepository } from "~/repositories/user.repository";
import {
  type UnassignForm,
  castAssignmentWithDate,
} from "~/utils/assignment/assignment";
import { isHttpError } from "~/utils/http/http-error.utils";
import { castPeriodWithDate } from "~/utils/http/cast-date/period.utils";
import { castAssignmentEventsWithDate } from "~/utils/http/cast-date/planning.utils";

type State = {
  volunteers: Map<number, VolunteerWithAssignmentDuration>;
  selectedVolunteer: VolunteerWithAssignmentDuration | null;
  selectedVolunteerFriends: AssignmentFriend[];
  assignments: AssignmentSummaryWithTask[];
  alreadyAssignedAssignments: AssignmentEvent[];
  hoverAssignment: AssignmentEvent | null;
  assignmentDetails: Assignment<{ withDetails: true }> | null;
};

export const useAssignVolunteerToTaskStore = defineStore(
  "assign-volunteer-to-task",
  {
    state: (): State => ({
      volunteers: new Map<number, VolunteerWithAssignmentDuration>(),
      selectedVolunteer: null,
      selectedVolunteerFriends: [],
      assignments: [],
      alreadyAssignedAssignments: [],
      hoverAssignment: null,
      assignmentDetails: null,
    }),
    actions: {
      async fetchVolunteers() {
        const res = await VolunteerToTaskRepository.getVolunteers();
        if (isHttpError(res)) return;
        this.volunteers = new Map<number, VolunteerWithAssignmentDuration>(
          res.map((volunteer) => [volunteer.id, volunteer]),
        );
      },

      async selectVolunteer(volunteer: VolunteerWithAssignmentDuration) {
        this.selectedVolunteer = volunteer;

        this.fetchPotentialAssignmentsFor(volunteer.id);
        this.fetchFriendsFor(volunteer.id);
      },

      async fetchFriendsFor(volunteerId: number) {
        const res =
          await VolunteerToTaskRepository.fetchFriendsFor(volunteerId);
        if (isHttpError(res)) return;
        this.selectedVolunteerFriends = res;
      },

      async fetchAllAssignmentsFor(volunteerId: number) {
        const res = await UserRepository.getVolunteerAssignments(volunteerId);
        if (isHttpError(res)) return;
        this.alreadyAssignedAssignments = castAssignmentEventsWithDate(res);
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
