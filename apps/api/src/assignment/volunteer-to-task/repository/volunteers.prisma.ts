import { Period } from "@overbookd/time";
import { PrismaService } from "../../../prisma.service";
import {
  DatabaseAssigneeWithAssignments,
  SELECT_VOLUNTEER_WITH_ASSIGNMENTS,
} from "./volunteer.query";
import { VolunteerWithAssignments, Volunteers } from "@overbookd/assignment";
import { hasAtLeastOneFriend } from "../../common/repository/friend.query";
import { HAS_AVAILABILITIES } from "../../common/repository/availabilities.query";
import { IS_MEMBER_OF_VOLUNTEER_TEAM } from "../../../common/query/user.query";
import { IS_NOT_DELETED } from "../../../common/query/not-deleted.query";
import {
  MinimalCharismaPeriod,
  SELECT_CHARISMA_PERIOD,
} from "../../../common/query/charisma.query";
import { Charisma } from "@overbookd/charisma";

export class PrismaVolunteers implements Volunteers {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<VolunteerWithAssignments[]> {
    const [volunteers, charismaPeriods] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          ...IS_NOT_DELETED,
          ...HAS_AVAILABILITIES,
          ...IS_MEMBER_OF_VOLUNTEER_TEAM,
        },
        select: SELECT_VOLUNTEER_WITH_ASSIGNMENTS,
      }),
      this.prisma.charismaPeriod.findMany({ select: SELECT_CHARISMA_PERIOD }),
    ]);
    return volunteers
      .map((volunteer) =>
        toVolunteerWithAssignments(volunteer, charismaPeriods),
      )
      .sort((a, b) => b.charisma - a.charisma);
  }
}

function toVolunteerWithAssignments(
  volunteer: DatabaseAssigneeWithAssignments,
  charismaPeriods: MinimalCharismaPeriod[],
): VolunteerWithAssignments {
  const assignments = volunteer.assigned.map(({ assignment }) =>
    Period.init(assignment),
  );
  const charisma = Charisma.init()
    .addEvents(volunteer.charismaEventParticipations)
    .addAvailabilities(volunteer.availabilities, charismaPeriods)
    .calculate();

  return {
    id: volunteer.id,
    firstname: volunteer.firstname,
    lastname: volunteer.lastname,
    nickname: volunteer.nickname,
    comment: volunteer.comment,
    note: volunteer.note,
    charisma,
    teams: volunteer.teams.map(({ teamCode }) => teamCode),
    preference: {
      assignment: volunteer.preference.assignment,
    },
    hasAtLeastOneFriend: hasAtLeastOneFriend(volunteer),
    assignments,
  };
}
