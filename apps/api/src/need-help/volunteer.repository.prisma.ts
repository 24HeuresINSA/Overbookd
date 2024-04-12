import { IProvidePeriod } from "@overbookd/period";
import { Volunteer } from "./need-help.model";
import { VolunteerRepository } from "./need-help.service";
import { PrismaService } from "../prisma.service";
import { AssignmentService } from "../assignment/old/assignment.service";
import { Injectable } from "@nestjs/common";
import {
  ACTIVE_NOT_ASSIGNED_FT_CONDITION,
  SELECT_FT_USER_REQUESTS_BY_USER_ID,
  SELECT_VOLUNTEER_ASSIGNMENTS,
} from "../user/user.query";
import { VolunteerTask } from "../user/user.model";
import {
  DatabaseAssignment,
  DatabaseFtUserRequest,
} from "../assignment/old/model/assignment.model";
import {
  formatAssignmentAsTask,
  formatRequirementAsTask,
} from "../utils/assignment";
import { BENEVOLE_CODE } from "@overbookd/team";

type DatabaseVolunteer = {
  id: number;
  lastname: string;
  firstname: string;
  phone: string;
  teams: { team: { code: string } }[];
  availabilities: IProvidePeriod[];
  assignments: DatabaseAssignment[];
  ftUserRequests: DatabaseFtUserRequest[];
};

const SELECT_VOLUNTEER = {
  id: true,
  lastname: true,
  firstname: true,
  phone: true,
  teams: { select: { team: { select: { code: true } } } },
  availabilities: { select: { start: true, end: true } },
};

const HAS_VOLUNTEER_TEAM = {
  teams: {
    some: {
      team: { code: BENEVOLE_CODE },
    },
  },
};

@Injectable()
export class PrismaVolunteerRepository implements VolunteerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAvailableOnPeriod(period: IProvidePeriod): Promise<Volunteer[]> {
    const select = SELECT_VOLUNTEER;
    const where = this.buildIsAvailableCondition(period);

    const volunteers = await this.prisma.user.findMany({
      select: {
        ...select,
        assignments: { select: SELECT_VOLUNTEER_ASSIGNMENTS },
        ftUserRequests: {
          select: SELECT_FT_USER_REQUESTS_BY_USER_ID,
          where: { ftTimeWindows: ACTIVE_NOT_ASSIGNED_FT_CONDITION },
        },
      },
      where,
    });

    return formatVolunteers(volunteers);
  }

  private buildIsAvailableCondition(period: IProvidePeriod) {
    const availabilities =
      AssignmentService.buildVolunteerIsAvailableDuringPeriodCondition(period);

    const assignments =
      AssignmentService.buildVolunteerIsNotAssignedOnTaskDuringPeriodCondition(
        period,
      );

    return {
      ...HAS_VOLUNTEER_TEAM,
      isDeleted: false,
      availabilities,
      assignments,
    };
  }
}

function formatVolunteers(volunteers: DatabaseVolunteer[]): Volunteer[] {
  return volunteers.map((volunteer) => ({
    id: volunteer.id,
    lastname: volunteer.lastname,
    firstname: volunteer.firstname,
    phone: volunteer.phone,
    teams: volunteer.teams.map(({ team }) => team.code),
    availabilities: volunteer.availabilities,
    tasks: [
      ...formatVolunteerAssignments(volunteer.assignments),
      ...formatVolunteerRequirements(volunteer.ftUserRequests),
    ],
  }));
}

function formatVolunteerAssignments(
  assignments: DatabaseAssignment[],
): VolunteerTask[] {
  return assignments.map(formatAssignmentAsTask);
}

function formatVolunteerRequirements(
  ftUserRequests: DatabaseFtUserRequest[],
): VolunteerTask[] {
  return ftUserRequests.map(formatRequirementAsTask);
}
