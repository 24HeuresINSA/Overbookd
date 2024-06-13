import type { VolunteerWithAssignmentDuration } from "@overbookd/assignment";
import type { AssignmentSummaryWithTask } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class VolunteerToTaskRepository {
  private static readonly basePath = "assignments/volunteer-to-task";

  static getVolunteers() {
    return HttpClient.get<VolunteerWithAssignmentDuration[]>(
      `${this.basePath}/volunteers`,
    );
  }

  static fetchPotentialAssignmentsFor(volunteerId: number) {
    return HttpClient.get<AssignmentSummaryWithTask[]>(
      `${this.basePath}/volunteers/${volunteerId}/assignments`,
    );
  }
}
