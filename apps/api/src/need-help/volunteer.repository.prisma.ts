import { IProvidePeriod } from '@overbookd/period';
import { Volunteer } from './need-help.model';
import { VolunteerRepository } from './need-help.service';
import { PrismaService } from '../../src/prisma.service';
import { AssignmentService } from '../../src/assignment/assignment.service';
import { WHERE_VALIDATED_USER } from '../../src/assignment/volunteer.service';
import { Injectable } from '@nestjs/common';
import {
  ACTIVE_NOT_ASSIGNED_FT_CONDITION,
  SELECT_FT_USER_REQUESTS_BY_USER_ID,
  SELECT_VOLUNTEER_ASSIGNMENTS,
  VolunteerTask,
} from '../../src/user/user.service';
import {
  DatabaseAssignment,
  DatabaseFtUserRequest,
} from '../assignment/model/assignment.model';
import {
  formatAssignmentAsTask,
  formatRequirementAsTask,
} from '../../src/utils/assignment';

type DatabaseVolunteer = {
  id: number;
  lastname: string;
  firstname: string;
  phone: string;
  team: { team: { code: string } }[];
  availabilities: IProvidePeriod[];
  assignments: DatabaseAssignment[];
  ftUserRequests: DatabaseFtUserRequest[];
};

const SELECT_VOLUNTEER = {
  id: true,
  lastname: true,
  firstname: true,
  phone: true,
  team: { select: { team: { select: { code: true } } } },
  availabilities: { select: { start: true, end: true } },
};

@Injectable()
export class PrismaVolunteerRepository implements VolunteerRepository {
  constructor(private readonly prisma: PrismaService) { }

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
      ...WHERE_VALIDATED_USER,
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
    teams: volunteer.team.map(({ team }) => team.code),
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
