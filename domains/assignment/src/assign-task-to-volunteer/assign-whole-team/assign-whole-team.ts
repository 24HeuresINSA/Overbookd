import { AssignmentIdentifier } from "../assignment";
import { Volunteer } from "../../volunteer";

export type AssignmentIdentifierWithTeam = AssignmentIdentifier & {
  as: string;
};

export type TeamAssignments = {
  findTeamAssignmentsToAddForVolunteer(
    volunteerId: Volunteer["id"],
  ): Promise<AssignmentIdentifierWithTeam[]>;
  findTeamAssignmentsToRemoveForVolunteer(
    volunteerId: Volunteer["id"],
  ): Promise<AssignmentIdentifier[]>;
  assign(
    assignments: AssignmentIdentifierWithTeam[],
    volunteerId: Volunteer["id"],
  ): Promise<void>;
  unassign(
    assignments: AssignmentIdentifier[],
    assigneeId: Volunteer["id"],
  ): Promise<void>;
};

export class AssignWholeTeam {
  constructor(private readonly teamAssignments: TeamAssignments) {}

  async addMissingTeamAssignments(volunteerId: Volunteer["id"]): Promise<void> {
    const missingTeamAssignments =
      await this.teamAssignments.findTeamAssignmentsToAddForVolunteer(
        volunteerId,
      );
    return this.teamAssignments.assign(missingTeamAssignments, volunteerId);
  }

  async removeIrrelevantTeamAssignments(
    volunteerId: Volunteer["id"],
  ): Promise<void> {
    const irrelevantTeamAssignments =
      await this.teamAssignments.findTeamAssignmentsToRemoveForVolunteer(
        volunteerId,
      );
    await this.teamAssignments.unassign(irrelevantTeamAssignments, volunteerId);
    return this.addMissingTeamAssignments(volunteerId);
  }
}
