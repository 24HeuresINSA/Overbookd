import { VolunteerNotFoundError } from "../../assignment.error.js";
import { Volunteer } from "../../volunteer.js";
import {
  VolunteerForAssignment,
  VolunteersForAssignmentRepository,
} from "./volunteers-for-assignment.js";

export class InMemoryVolunteersForAssignment implements VolunteersForAssignmentRepository {
  constructor(private volunteers: VolunteerForAssignment[] = []) {}

  findOne(volunteerId: Volunteer["id"]): Promise<VolunteerForAssignment> {
    const volunteer = this.volunteers.find(({ id }) => id === volunteerId);
    if (!volunteer) throw new VolunteerNotFoundError(volunteerId);
    return Promise.resolve(volunteer);
  }
}
