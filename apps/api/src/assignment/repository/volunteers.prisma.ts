import { Period } from "@overbookd/period";
import { PrismaService } from "../../prisma.service";
import { Volunteers } from "../volunteer.service";
import {
  IS_NOT_DELETED,
  SELECT_ASSIGNMENTS,
  SELECT_VOLUNTEER,
  HAS_VOLUNTEER_TEAM,
  DatabaseAssigneeWithAssignments,
} from "./assignee.query";
import {
  CalculeVolunteerAssignmentDuration,
  Volunteer,
} from "@overbookd/assignment";

export class PrismaVolunteers implements Volunteers {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Volunteer[]> {
    const volunteers = await this.prisma.user.findMany({
      where: {
        ...IS_NOT_DELETED,
        ...HAS_VOLUNTEER_TEAM,
      },
      select: {
        ...SELECT_VOLUNTEER,
        ...SELECT_ASSIGNMENTS,
      },
      orderBy: { charisma: "desc" },
    });
    return volunteers.map(toVolunteer);
  }
}

function toVolunteer(volunteer: DatabaseAssigneeWithAssignments): Volunteer {
  const periods = volunteer.assigned
    .flatMap((a) => a.assignment)
    .flatMap(({ end, start }) => Period.init({ start, end }));
  const assignmentDuration =
    CalculeVolunteerAssignmentDuration.fromPeriods(periods);

  return {
    id: volunteer.id,
    firstname: volunteer.firstname,
    lastname: volunteer.lastname,
    comment: volunteer.comment,
    charisma: volunteer.charisma,
    teams: volunteer.teams.map((t) => t.team.code),
    assignmentDuration,
  };
}
