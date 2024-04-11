import { Period } from "@overbookd/period";
import { PrismaService } from "../../prisma.service";
import {
  IS_NOT_DELETED,
  SELECT_ASSIGNMENTS,
  SELECT_VOLUNTEER,
  HAS_VOLUNTEER_TEAM,
  DatabaseAssigneeWithAssignments,
} from "./assignee.query";
import { AssigneeWithAssignments, Assignees } from "@overbookd/assignment";

export class PrismaAssignees implements Assignees {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AssigneeWithAssignments[]> {
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
    return volunteers.map(toAssigneeWithAssignments);
  }
}

function toAssigneeWithAssignments(
  assignee: DatabaseAssigneeWithAssignments,
): AssigneeWithAssignments {
  const assignments = assignee.assigned
    .flatMap((a) => a.assignment)
    .flatMap(({ end, start }) => Period.init({ start, end }));

  return {
    id: assignee.id,
    firstname: assignee.firstname,
    lastname: assignee.lastname,
    comment: assignee.comment,
    charisma: assignee.charisma,
    teams: assignee.teams.map((t) => t.team.code),
    assignments,
  };
}
