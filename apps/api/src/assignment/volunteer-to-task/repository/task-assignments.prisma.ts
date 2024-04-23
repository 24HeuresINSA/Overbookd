import { TaskAssignment } from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import { TaskAssignments } from "@overbookd/assignment";
import { Period } from "@overbookd/period";

export class PrismaTaskAssignments implements TaskAssignments {
  constructor(private readonly prisma: PrismaService) {}

  async findAssignableFor(
    volunteerAssignments: Period[],
    oneOfTheTeams: string[],
  ): Promise<TaskAssignment[]> {
    console.log(volunteerAssignments, oneOfTheTeams);
    throw new Error("Method not implemented.");
  }
}
