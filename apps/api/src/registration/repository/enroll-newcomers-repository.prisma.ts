import {
  STAFF,
  EnrolledNewcomer,
  Teams,
  isJoinableTeams,
} from "@overbookd/registration";
import { EnrollNewcomersRepository } from "./enroll-newcomers.repository";
import { PrismaService } from "../../prisma.service";
import {
  DatabaseEnrollableStaff as DatabaseEnrollableStaff,
  DatabaseTeamCode,
  SELECT_STAFF,
  NOT_VOLUNTEER_YET,
  DatabaseEnrollableVolunteer,
  IS_ENROLLABLE_VOLUNTEER,
} from "./enroll-newcomers.query";
import { EnrollableStaff, EnrollableVolunteer } from "@overbookd/http";
import { SELECT_VOLUNTEER } from "./enroll-newcomers.query";

export class PrismaEnrollNewcomersRepository
  implements EnrollNewcomersRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async enroll(newcomers: EnrolledNewcomer[]) {
    const allRequests = newcomers.map(({ id, teams }) =>
      this.prisma.user.update({
        where: { id },
        data: {
          teams: {
            createMany: {
              data: teams.map((team) => ({ teamCode: team })),
            },
          },
        },
      }),
    );
    await this.prisma.$transaction(allRequests);
  }

  async findEnrollableStaffs(): Promise<EnrollableStaff[]> {
    const staffs = await this.prisma.user.findMany({
      orderBy: { id: "asc" },
      where: {
        isDeleted: false,
        registrationMembership: STAFF,
        ...NOT_VOLUNTEER_YET,
      },
      select: SELECT_STAFF,
    });
    return staffs.map(formatToEnrollableStaff);
  }

  async findEnrollableVolunteers(): Promise<EnrollableVolunteer[]> {
    const volunteers = await this.prisma.user.findMany({
      orderBy: { id: "desc" },
      where: IS_ENROLLABLE_VOLUNTEER,
      select: SELECT_VOLUNTEER,
    });
    return volunteers.map(formatToEnrollableVolunteer);
  }

  async findEnrollableVolunteer(
    volunteerId: number,
  ): Promise<EnrollableVolunteer | null> {
    const volunteer = await this.prisma.user.findFirst({
      where: { id: volunteerId, ...IS_ENROLLABLE_VOLUNTEER },
      select: SELECT_VOLUNTEER,
    });
    if (!volunteer) return null;
    return formatToEnrollableVolunteer(volunteer);
  }
}

function formatToEnrollableVolunteer(
  volunteer: DatabaseEnrollableVolunteer,
): EnrollableVolunteer {
  return {
    ...formatToEnrollableStaff(volunteer),
    charisma: volunteer.charisma,
    availabilities: volunteer.availabilities,
    mobilePhone: volunteer.phone,
    comment: volunteer.comment === null ? undefined : volunteer.comment,
    birthdate: volunteer.birthdate,
  };
}

function formatToEnrollableStaff(
  staff: DatabaseEnrollableStaff,
): EnrollableStaff {
  const teams = formatTeamsToJoinableTeams(staff.teams);
  return {
    id: staff.id,
    firstname: staff.firstname,
    lastname: staff.lastname,
    email: staff.email,
    registeredAt: staff.createdAt,
    teams,
  };
}

function formatTeamsToJoinableTeams(teams: DatabaseTeamCode[]): Teams {
  const joinableTeams = teams.map(({ team }) => team.code);
  return isJoinableTeams(joinableTeams) ? joinableTeams : [];
}
