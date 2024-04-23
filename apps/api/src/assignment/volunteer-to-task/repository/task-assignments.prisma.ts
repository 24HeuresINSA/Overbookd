import {
  AssignmentCondition,
  TaskAssignmentForVolunteer,
} from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import { TaskAssignments } from "@overbookd/assignment";

export class PrismaTaskAssignments implements TaskAssignments {
  constructor(private readonly prisma: PrismaService) {}

  async findAssignableFor({
    volunteerId,
    oneOfTheTeams,
  }: AssignmentCondition): Promise<TaskAssignmentForVolunteer[]> {
    console.log(volunteerId, oneOfTheTeams);
    throw new Error("Method not implemented.");
  }
}
