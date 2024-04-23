import { AssignmentSummaryWithTask } from "@overbookd/http";
import { AvailableAssignments } from "../volunteer-to-task.service";
import { PrismaService } from "../../../prisma.service";

export class PrismaAvailableAssignments implements AvailableAssignments {
  constructor(private readonly prisma: PrismaService) {}

  async findAssignableFor(
    volunteerId: number,
  ): Promise<AssignmentSummaryWithTask[]> {
    console.log(volunteerId);
    throw new Error("Method not implemented.");
  }
}
