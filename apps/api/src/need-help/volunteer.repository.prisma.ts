import { IProvidePeriod } from "@overbookd/period";
import { HelpingVolunteers } from "./need-help.service";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { BENEVOLE_CODE } from "@overbookd/team";
import { HelpingVolunteer } from "@overbookd/http";

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
          start: true,
          end: true,
          festivalTask: { select: { id: true, name: true } },
        },
      },
    },
  },
};

const SELECT_VOLUNTEER = {
  id: true,
  lastname: true,
  firstname: true,
  phone: true,
  teams: { select: { teamCode: true } },
  availabilities: { select: { start: true, end: true } },
  ...SELECT_ASSIGNEES,
};

const IS_MEMBER_OF_VOLUNTEER_TEAM = {
  teams: { some: { team: { code: BENEVOLE_CODE } } },
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
      isDeleted: false,
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
