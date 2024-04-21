import { Assignment, AssignmentIdentifier } from "@overbookd/assignment";
import { Assignments } from "../assignment.service";
import { PrismaService } from "../../../prisma.service";

export class PrismaAssignments implements Assignments {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(identifier: AssignmentIdentifier): Promise<Assignment> {
    console.log("PrismaAssignments.findOne", identifier);
    throw new Error("Method not implemented.");
  }
}
