import { Period } from "@overbookd/period";
import { PrismaService } from "../../../prisma.service";
import {
  IS_NOT_DELETED,
  IS_MEMBER_OF_VOLUNTEER_TEAM,
  DatabaseAssigneeWithAssignments,
  SELECT_VOLUNTEER_WITH_ASSIGNMENTS,
} from "./volunteer.query";
import { VolunteerWithAssignments, Volunteers } from "@overbookd/assignment";

export class PrismaVolunteers implements Volunteers {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<VolunteerWithAssignments[]> {
    const volunteers = await this.prisma.user.findMany({
      where: {
        ...IS_NOT_DELETED,
        ...IS_MEMBER_OF_VOLUNTEER_TEAM,
      },
      select: SELECT_VOLUNTEER_WITH_ASSIGNMENTS,
      orderBy: { charisma: "desc" },
    });
    return volunteers.map(toVolunteerWithAssignments);
  }
}

function toVolunteerWithAssignments(
  volunteer: DatabaseAssigneeWithAssignments,
): VolunteerWithAssignments {
  const assignments = volunteer.assigned.map(({ assignment }) =>
    Period.init(assignment),
  );

  return {
    id: volunteer.id,
    firstname: volunteer.firstname,
    lastname: volunteer.lastname,
    nickname: volunteer.nickname,
    comment: volunteer.comment,
    note: volunteer.note,
    charisma: volunteer.charisma,
    teams: volunteer.teams.map((t) => t.team.code),
    assignments,
  };
}
