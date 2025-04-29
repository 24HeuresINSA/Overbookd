import { IProvidePeriod } from "@overbookd/time";
import { HelpingVolunteers } from "./need-help.service";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { HelpingVolunteer } from "@overbookd/http";
import { SELECT_PERIOD } from "../common/query/period.query";
import {
  IS_MEMBER_OF_VOLUNTEER_TEAM,
  SELECT_TEAMS_CODE,
  SELECT_USER_IDENTIFIER,
} from "../common/query/user.query";
import { IS_NOT_DELETED } from "../common/query/not-deleted.query";

type DatabaseHelpingVolunteer = {
  id: number;
  lastname: string;
  firstname: string;
  phone: string;
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
  phone: true,
  availabilities: { select: SELECT_PERIOD },
};

@Injectable()
export class PrismaHelpingVolunteers implements HelpingVolunteers {
  constructor(private readonly prisma: PrismaService) {}

  async findAvailableOnPeriod(
    period: IProvidePeriod,
  ): Promise<HelpingVolunteer[]> {
    const volunteers = await this.prisma.user.findMany({
      where: this.buildIsAvailableCondition(period),
      select: SELECT_VOLUNTEER,
    });

    return volunteers.map(toHelpingVolunteer);
  }

  private buildIsAvailableCondition({ start, end }: IProvidePeriod) {
    return {
      ...IS_MEMBER_OF_VOLUNTEER_TEAM,
      ...IS_NOT_DELETED,
      availabilities: {
        some: {
          start: { lte: start },
          end: { gte: end },
        },
      },
      assigned: {
        none: {
          assignment: {
            start: { lt: end },
            end: { gt: start },
          },
        },
      },
    };
  }
}

function toHelpingVolunteer(
  volunteer: DatabaseHelpingVolunteer,
): HelpingVolunteer {
  return {
    id: volunteer.id,
    lastname: volunteer.lastname,
    firstname: volunteer.firstname,
    phone: volunteer.phone,
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
