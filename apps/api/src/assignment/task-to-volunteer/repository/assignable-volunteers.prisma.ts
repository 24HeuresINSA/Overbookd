import { AssignableVolunteers } from "@overbookd/assignment";
import { StoredAssignableVolunteer } from "@overbookd/assignment/src/assign-task-to-volunteer/assignable-volunteer";
import { Category } from "@overbookd/festival-event-constants";
import { IProvidePeriod } from "@overbookd/period";
import { PrismaService } from "../../../prisma.service";

export class PrismaAssignableVolunteers implements AssignableVolunteers {
  constructor(private readonly prisma: PrismaService) {}

  on(
    period: IProvidePeriod,
    oneOfTheTeams: string[],
    category?: Category,
  ): Promise<StoredAssignableVolunteer[]> {
    console.log(
      "PrismaAssignableVolunteers.on",
      period,
      oneOfTheTeams,
      category,
    );
    throw new Error("Not yet implemented.");
  }
}
