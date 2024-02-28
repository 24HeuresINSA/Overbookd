import {
  ADHERENT,
  EnrolledNewcomer,
  Teams,
  VOLUNTEER,
  isJoinableTeams,
} from "@overbookd/registration";
import { EnrollNewcomersRepository } from "./enroll-newcomers.repository";
import { PrismaService } from "../../prisma.service";
import {
  DatabaseEnrollableAdherent as DatabaseEnrollableAdherent,
  DatabaseTeamCode,
  SELECT_ADHERENT,
  NOT_VOLUNTEER_YET,
  DatabaseEnrollableVolunteer,
} from "./enroll-newcomers.query";
import { EnrollableAdherent, EnrollableVolunteer } from "@overbookd/http";
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

  async findEnrollableAdherents(): Promise<EnrollableAdherent[]> {
    const adherents = await this.prisma.user.findMany({
      orderBy: { id: "asc" },
      where: {
        isDeleted: false,
        registrationMembership: ADHERENT,
        ...NOT_VOLUNTEER_YET,
      },
      select: SELECT_ADHERENT,
    });
    return adherents.map(formatToEnrollableAdherent);
  }

  async findEnrollableVolunteers(): Promise<EnrollableVolunteer[]> {
    const volunteers = await this.prisma.user.findMany({
      orderBy: { id: "desc" },
      where: {
        isDeleted: false,
        OR: [
          { registrationMembership: null },
          { registrationMembership: VOLUNTEER },
        ],
        ...NOT_VOLUNTEER_YET,
      },
      select: SELECT_VOLUNTEER,
    });
    return volunteers.map(formatToEnrollableVolunteer);
  }
}

function formatToEnrollableVolunteer(
  volunteer: DatabaseEnrollableVolunteer,
): EnrollableVolunteer {
  return {
    ...formatToEnrollableAdherent(volunteer),
    charisma: volunteer.charisma,
    availabilities: volunteer.availabilities,
    mobilePhone: volunteer.phone,
    comment: volunteer.comment,
    birthdate: volunteer.birthdate,
  };
}

function formatToEnrollableAdherent(
  adherent: DatabaseEnrollableAdherent,
): EnrollableAdherent {
  const teams = formatTeamsToJoinableTeams(adherent.teams);
  return {
    id: adherent.id,
    firstname: adherent.firstname,
    lastname: adherent.lastname,
    email: adherent.email,
    registeredAt: adherent.createdAt,
    teams,
  };
}

function formatTeamsToJoinableTeams(teams: DatabaseTeamCode[]): Teams {
  const joinableTeams = teams.map(({ team }) => team.code);
  return isJoinableTeams(joinableTeams) ? joinableTeams : [];
}
