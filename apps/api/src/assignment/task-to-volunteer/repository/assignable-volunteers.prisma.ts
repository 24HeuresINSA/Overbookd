import {
  AssignableVolunteers,
  AssignmentIdentifier,
} from "@overbookd/assignment";
import { StoredAssignableVolunteer } from "@overbookd/assignment/src/assign-task-to-volunteer/assignable-volunteer";
import { Category } from "@overbookd/festival-event-constants";
import { PrismaService } from "../../../prisma.service";

export class PrismaAssignableVolunteers implements AssignableVolunteers {
  constructor(private readonly prisma: PrismaService) {}

  on(
    assignment: AssignmentIdentifier,
    oneOfTheTeams: string[],
    category?: Category,
  ): Promise<StoredAssignableVolunteer[]> {
    console.log(
      "PrismaAssignableVolunteers.on",
      assignment,
      oneOfTheTeams,
      category,
    );
    throw new Error("Not yet implemented.");
  }
}
