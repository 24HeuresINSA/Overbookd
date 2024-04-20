import {
  AssignableVolunteers,
  AssignmentSpecification,
  MobilizationIdentifier,
} from "@overbookd/assignment";
import { StoredAssignableVolunteer } from "@overbookd/assignment/src/assign-task-to-volunteer/assignable-volunteer";
import { PrismaService } from "../../../prisma.service";

export class PrismaAssignableVolunteers implements AssignableVolunteers {
  constructor(private readonly prisma: PrismaService) {}

  on(
    mobilizationIdentifier: MobilizationIdentifier,
    assignmentSpecification: AssignmentSpecification,
  ): Promise<StoredAssignableVolunteer[]> {
    console.log(
      "PrismaAssignableVolunteers.on",
      mobilizationIdentifier,
      assignmentSpecification,
    );
    throw new Error("Not yet implemented.");
  }
}
