import { Period } from 'src/volunteer-availability/domain/period.model';
import { Volunteer } from './needHelp.model';
import { VolunteerRepository } from './needHelp.service';
import { PrismaService } from 'src/prisma.service';
import { AssignmentService } from 'src/assignment/assignment.service';
import { WHERE_VALIDATED_USER } from 'src/assignment/volunteer.service';
import { Injectable } from '@nestjs/common';

type DatabaseVolunteer = {
  id: number;
  lastname: string;
  firstname: string;
  phone: string;
  team: { team: { code: string } }[];
};

const SELECT_VOLUNTEER = {
  id: true,
  lastname: true,
  firstname: true,
  phone: true,
  team: { select: { team: { select: { code: true } } } },
};

@Injectable()
export class PrismaVolunteerRepository implements VolunteerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAvailableOnPeriod(period: Period): Promise<Volunteer[]> {
    const select = SELECT_VOLUNTEER;
    const where = this.buildIsAvailableCondition(period);

    const volunteers = await this.prisma.user.findMany({
      select,
      where,
    });

    return formatVolunteers(volunteers);
  }

  private buildIsAvailableCondition(period: Period) {
    const availabilities =
      AssignmentService.buildVolunteerIsAvailableDuringPeriodCondition(period);

    const assignments =
      AssignmentService.buildVolunteerIsNotAssignedOnTaskDuringPeriodCondition(
        period,
      );

    return {
      ...WHERE_VALIDATED_USER,
      is_deleted: false,
      availabilities,
      assignments,
    };
  }
}

function formatVolunteers(volunteers: DatabaseVolunteer[]): Volunteer[] {
  return volunteers.map(({ id, lastname, firstname, phone, team }) => ({
    id,
    lastname,
    firstname,
    phone,
    teams: team.map(({ team }) => team.code),
  }));
}
