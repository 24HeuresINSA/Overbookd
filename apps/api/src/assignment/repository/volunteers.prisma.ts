import { Period } from "@overbookd/period";
import { PrismaService } from "../../prisma.service";
import { Volunteer } from "../model/volunteer.model";
import { Volunteers } from "../volunteer.service";
import {
  IS_NOT_DELETED,
  SELECT_ASSIGNED_PERIOD,
  SELECT_VOLUNTEER,
  HAS_VOLUNTEER_TEAM,
  DatabaseVolunteer,
} from "./volunteer.query";

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
        ...SELECT_ASSIGNED_PERIOD,
      },
      orderBy: { charisma: "desc" },
    });
    return volunteers.map(formatVolunteer);
  }
}

function formatVolunteer(volunteer: DatabaseVolunteer): Volunteer {
  const assignmentDuration = volunteer.assigned.reduce(
    (acc, assignment) =>
      acc + Period.init(assignment.assignment).duration.inMilliseconds,
    0,
  );

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
