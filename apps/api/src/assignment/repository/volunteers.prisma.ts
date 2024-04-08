import { Period } from "@overbookd/period";
import { PrismaService } from "../../prisma.service";
import { Volunteers } from "../volunteer.service";
import {
  IS_NOT_DELETED,
  SELECT_ASSIGNED_TASK,
  SELECT_VOLUNTEER,
  HAS_VOLUNTEER_TEAM,
  DatabaseVolunteer,
} from "./volunteer.query";
import { Volunteer } from "@overbookd/assignment";

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
        ...SELECT_ASSIGNED_TASK,
      },
      orderBy: { charisma: "desc" },
    });
    return volunteers.map(formatVolunteer);
  }
}

function formatVolunteer(volunteer: DatabaseVolunteer): Volunteer {
  const assignmentDuration = volunteer.assigned.reduce(
    (acc, task) => acc + Period.init(task.assignment).duration.inMilliseconds,
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
