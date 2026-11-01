import { VolunteerNotFoundError } from "../assignment.error.js";
import { Volunteer } from "../volunteer.js";
import {
  VolunteerWithAssignments,
  Volunteers,
} from "./assign-volunteer-to-task.js";

export class InMemoryVolunteers implements Volunteers {
  constructor(private volunteers: VolunteerWithAssignments[] = []) {}

  findAll() {
    return Promise.resolve(this.volunteers);
  }

  findOne(volunteerId: Volunteer["id"]): Promise<VolunteerWithAssignments> {
    const volunteer = this.volunteers.find(({ id }) => id === volunteerId);
    if (!volunteer) throw new VolunteerNotFoundError(volunteerId);
    return Promise.resolve(volunteer);
  }
}
