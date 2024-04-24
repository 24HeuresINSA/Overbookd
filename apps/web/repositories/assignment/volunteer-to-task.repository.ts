import { VolunteerWithAssignmentDuration } from "@overbookd/assignment";
import { AssignmentSummaryWithTask, HttpStringified } from "@overbookd/http";
import { Context } from "../context";

export class VolunteerToTaskRepository {
  private static readonly basePath = "assignments/volunteer-to-task";

  static getVolunteers(context: Context) {
    return context.$axios.get<
      HttpStringified<VolunteerWithAssignmentDuration[]>
    >(`${this.basePath}/volunteers`);
  }

  static getAssignmentsFor(context: Context, volunteerId: number) {
    return context.$axios.get<HttpStringified<AssignmentSummaryWithTask[]>>(
      `${this.basePath}/volunteers/${volunteerId}/assignments`,
    );
  }
}
