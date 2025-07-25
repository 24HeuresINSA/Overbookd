import { IProvidePeriod } from "@overbookd/time";
import { MultiPlanningVolunteers } from "./multi-planning.service";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { MultiPlanningVolunteer } from "@overbookd/http";
import { SELECT_PERIOD } from "../common/query/period.query";
import {
  IS_MEMBER_OF_VOLUNTEER_TEAM,
  SELECT_TEAMS_CODE,
  SELECT_USER_IDENTIFIER,
} from "../common/query/user.query";
import { IS_NOT_DELETED } from "../common/query/not-deleted.query";
import { User } from "@overbookd/user";

type DatabaseVolunteer = User & {
  teams: { teamCode: string }[];
  availabilities: IProvidePeriod[];
  assigned: {
    assignment: IProvidePeriod & { festivalTask: { id: number; name: string } };
  }[];
};

const SELECT_ASSIGNEES = {
  assigned: {
    select: {
      assignment: {
        select: {
          ...SELECT_PERIOD,
          festivalTask: { select: { id: true, name: true } },
        },
      },
    },
  },
};

const SELECT_VOLUNTEER = {
  ...SELECT_USER_IDENTIFIER,
  ...SELECT_TEAMS_CODE,
  ...SELECT_ASSIGNEES,
  availabilities: { select: SELECT_PERIOD },
};

@Injectable()
export class PrismaMultiPlanningVolunteers implements MultiPlanningVolunteers {
  constructor(private readonly prisma: PrismaService) {}

  async findVolunteers(
    volunteerIds: number[],
  ): Promise<MultiPlanningVolunteer[]> {
    const volunteers = await this.prisma.user.findMany({
      where: this.buildIsInIdsCondition(volunteerIds),
      select: SELECT_VOLUNTEER,
    });

    return volunteers.map(toMultiPlanningVolunteer);
  }

  private buildIsInIdsCondition(volunteerIds: number[]) {
    return {
      id: { in: volunteerIds },
      ...IS_MEMBER_OF_VOLUNTEER_TEAM,
      ...IS_NOT_DELETED,
    };
  }
}

function toMultiPlanningVolunteer(
  volunteer: DatabaseVolunteer,
): MultiPlanningVolunteer {
  return {
    id: volunteer.id,
    lastname: volunteer.lastname,
    nickname: volunteer.nickname,
    firstname: volunteer.firstname,
    teams: volunteer.teams.map(({ teamCode }) => teamCode),
    availabilities: volunteer.availabilities,
    assignments: volunteer.assigned.map((assignment) => ({
      id: assignment.assignment.festivalTask.id,
      name: assignment.assignment.festivalTask.name,
      start: assignment.assignment.start,
      end: assignment.assignment.end,
    })),
  };
}
