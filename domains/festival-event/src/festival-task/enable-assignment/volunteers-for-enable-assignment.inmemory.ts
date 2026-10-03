import {
  extractVolunteerData,
  VolunteersForEnableAssignment,
} from "./enable-assignment.js";
import { Volunteer, VolunteerWithTeams } from "../sections/instructions.js";

export class InMemoryVolunteersForEnableAssignment implements VolunteersForEnableAssignment {
  constructor(private volunteers: VolunteerWithTeams[]) {}

  findByTeam(team: string): Promise<Volunteer[]> {
    const volunteers = this.volunteers.filter((volunteer) =>
      volunteer.teams.includes(team),
    );
    return Promise.resolve(volunteers.map(extractVolunteerData));
  }
}
