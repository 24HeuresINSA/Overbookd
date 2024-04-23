import { Assignment } from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import { TaskAssignments } from "@overbookd/assignment";
import { Period } from "@overbookd/period";

export class PrismaTaskAssignments implements TaskAssignments {
  constructor(private readonly prisma: PrismaService) {}

  async findAssignableFor(
    volunteerAssignments: Period[],
    oneOfTheTeams: string[],
  ): Promise<Assignment[]> {
    console.log(volunteerAssignments, oneOfTheTeams);
    throw new Error("Method not implemented.");
  }
}
