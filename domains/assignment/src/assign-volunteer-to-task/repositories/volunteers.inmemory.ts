import {
  VolunteerWithAssignments,
  Volunteers,
} from "../assign-volunteer-to-task";

export class InMemoryVolunteers implements Volunteers {
  constructor(private volunteers: VolunteerWithAssignments[] = []) {}

  findAll() {
    return Promise.resolve(this.volunteers);
  }
}
