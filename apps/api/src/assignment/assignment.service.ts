import { Injectable, NotFoundException } from "@nestjs/common";
import { FtTeamRequest, FtTimeSpan } from "@prisma/client";
import { IProvidePeriod } from "@overbookd/period";
import { PrismaService } from "../prisma.service";
import { TeamService } from "../team/team.service";
import { getOtherAssignableTeams } from "../team/underlying-teams.utils";
import { VolunteerAssignmentStat } from "../user/dto/volunteer-assignment-stat.response.dto";
import { UserService } from "../user/user.service";
import { SELECT_TIMESPAN_PERIOD_WITH_CATEGORY } from "../user/user.query";
import { WHERE_IS_VOLUNTEER } from "./volunteer.service";

const SELECT_TEAM_REQUEST = {
  id: true,
  teamCode: true,
  quantity: true,
};

export const SELECT_BASE_TIMESPAN = {
  id: true,
  start: true,
  end: true,
};

const SELECT_ASSIGNMENT = {
  assigneeId: true,
  timeSpanId: true,
  teamRequestId: true,
};

function buildTimeSpanWithStatsSelection(timeSpanId: number, teamCode: string) {
  return {
    ...SELECT_BASE_TIMESPAN,
    timeWindow: {
      select: {
        teamRequests: {
          where: { teamCode },
          select: {
            ...SELECT_TEAM_REQUEST,
            _count: {
              select: {
                assignments: { where: { timeSpanId } },
              },
            },
          },
        },
      },
    },
  };
}

type TeamRequest = Pick<FtTeamRequest, "quantity" | "id" | "teamCode">;

type DataBaseTeamRequestWithAssignmentStats = TeamRequest & {
  _count: {
    assignments: number;
  };
};

type DataBaseTimeSpanWithStats = Pick<FtTimeSpan, "id" | "start" | "end"> & {
  timeWindow: {
    teamRequests: DataBaseTeamRequestWithAssignmentStats[];
  };
};

type TeamRequestWithAssignmentStats = TeamRequest & {
  assigned: number;
};

export type Assignment = {
  assigneeId: number;
  timeSpanId: number;
  teamRequestId?: number;
  userRequestId?: number;
};

export type VolunteerAssignmentRequest = {
  teamCode: string;
  id: number;
};

export type AssignmentStats = {
  firstname: string;
  lastname: string;
  stats: VolunteerAssignmentStat[];
};

@Injectable()
export class AssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async assignVolunteersToTimeSpan(
    volunteers: VolunteerAssignmentRequest[],
    timeSpanId: number,
  ): Promise<Assignment[]> {
    const assignments = await Promise.all(
      volunteers.map((volunteer) =>
        this.prepareAssignment(volunteer, timeSpanId),
      ),
    );
    return this.prisma.$transaction(
      assignments.map((volunteerAssignment) =>
        this.prisma.oldAssignment.create({
          data: volunteerAssignment,
          select: SELECT_ASSIGNMENT,
        }),
      ),
    );
  }

  private async prepareAssignment(
    { teamCode, id }: VolunteerAssignmentRequest,
    timeSpanId: number,
  ): Promise<Assignment> {
    const timeSpan = await this.retrieveTimeSpan(timeSpanId, teamCode);
    await this.checkVolunteerCompatibility(id, timeSpan, teamCode);

    const teamRequestId = this.retrieveTeamRequestId(timeSpan, teamCode);
    return {
      timeSpanId,
      teamRequestId,
      assigneeId: id,
    };
  }

  async unassignVolunteerToTimeSpan(
    assigneeId: number,
    timeSpanId: number,
  ): Promise<void> {
    await this.prisma.oldAssignment.deleteMany({
      where: {
        assigneeId,
        timeSpanId,
      },
    });
  }

  async updateAssignedTeam(
    timeSpanId: number,
    assigneeId: number,
    teamCode: string,
  ): Promise<Assignment> {
    const timeSpan = await this.retrieveTimeSpan(timeSpanId, teamCode);
    const teamRequestId = this.retrieveTeamRequestId(timeSpan, teamCode);
    return this.prisma.oldAssignment.update({
      where: {
        timeSpanId_assigneeId: {
          timeSpanId,
          assigneeId,
        },
      },
      data: { teamRequestId },
      select: SELECT_ASSIGNMENT,
    });
  }

  async getVolunteersAssignmentStats(): Promise<AssignmentStats[]> {
    const volunteers = await this.prisma.user.findMany({
      where: { isDeleted: false, teams: { none: { team: { code: "hard" } } } },
      select: {
        firstname: true,
        lastname: true,
        assignments: { select: SELECT_TIMESPAN_PERIOD_WITH_CATEGORY },
      },
    });
    return volunteers.map(({ assignments, ...volunteer }) => {
      const stats = UserService.formatAssignmentStats(assignments);
      return { ...volunteer, stats };
    });
  }

  private async retrieveTimeSpan(timeSpanId: number, teamCode: string) {
    const timeSpan = await this.getTimeSpanWithItStats(timeSpanId, teamCode);

    if (!timeSpan) {
      throw new NotFoundException(
        "Le créneau n'existe pas avec la team demandée. Allez regarder la FT.",
      );
    }
    return timeSpan;
  }

  private async checkVolunteerCompatibility(
    volunteerId: number,
    timeSpan: DataBaseTimeSpanWithStats,
    teamCode: string,
  ): Promise<void> {
    const volunteer = await this.getVolunteer(volunteerId, timeSpan, teamCode);

    if (!volunteer) {
      throw new NotFoundException(
        "Le bénévole demandé ne peut pas être assigné à ce créneau. Un autre humain vous a peut-être devancé.",
      );
    }
  }

  private retrieveTeamRequestId(
    timeSpan: DataBaseTimeSpanWithStats,
    teamCode: string,
  ) {
    const teamRequestsStats = this.extractTeamRequestsStats(timeSpan);

    const teamRequestId = this.selectTeamRequestId(teamRequestsStats, teamCode);

    if (teamRequestId === 0) {
      throw new NotFoundException(
        "Aucune équipe compatible n'est disponible pour ce créneau. Un autre humain vous a peut-être devancé.",
      );
    }
    return teamRequestId;
  }

  private extractTeamRequestsStats(timeSpan: DataBaseTimeSpanWithStats) {
    return timeSpan.timeWindow.teamRequests.map(
      convertToTeamRequestWithAssignmentStats,
    );
  }

  private async getVolunteer(
    volunteerId: number,
    timeSpan: IProvidePeriod,
    teamCode: string,
  ): Promise<{ id: number } | null> {
    const availabilities =
      AssignmentService.buildVolunteerIsAvailableDuringPeriodCondition(
        timeSpan,
      );

    const assignments =
      AssignmentService.buildVolunteerIsNotAssignedOnTaskDuringPeriodCondition(
        timeSpan,
      );

    const teams = this.buildVolunteerIsMemberOfTeamCondition(teamCode);

    return this.prisma.user.findFirst({
      select: { id: true },
      where: {
        id: volunteerId,
        ...WHERE_IS_VOLUNTEER,
        availabilities,
        assignments,
        teams,
      },
    });
  }

  private buildVolunteerIsMemberOfTeamCondition(teamCode: string) {
    const assignableTeams = getOtherAssignableTeams(teamCode);
    const team = TeamService.buildIsMemberOfCondition([
      teamCode,
      ...assignableTeams,
    ]);
    return team;
  }

  static buildVolunteerIsNotAssignedOnTaskDuringPeriodCondition({
    start,
    end,
  }: IProvidePeriod) {
    return {
      every: {
        NOT: [{ timeSpan: { start: { lt: end }, end: { gt: start } } }],
      },
    };
  }

  static buildVolunteerIsAvailableDuringPeriodCondition({
    start,
    end,
  }: IProvidePeriod) {
    return {
      some: {
        start: { lte: start },
        end: { gte: end },
      },
    };
  }

  private getTimeSpanWithItStats(timeSpanId: number, teamCode: string) {
    return this.prisma.ftTimeSpan.findFirst({
      where: {
        id: timeSpanId,
        timeWindow: {
          teamRequests: { some: { teamCode } },
        },
      },
      select: buildTimeSpanWithStatsSelection(timeSpanId, teamCode),
    });
  }

  private selectTeamRequestId(
    teamRequests: TeamRequestWithAssignmentStats[],
    teamCode: string,
  ): number {
    const teamRequest = teamRequests.find(
      (tr) => tr.quantity > tr.assigned && tr.teamCode === teamCode,
    );
    return teamRequest?.id ?? 0;
  }
}

function convertToTeamRequestWithAssignmentStats({
  id,
  teamCode,
  quantity,
  _count,
}: DataBaseTeamRequestWithAssignmentStats): TeamRequestWithAssignmentStats {
  return {
    id,
    teamCode,
    quantity,
    assigned: _count.assignments,
  };
}
