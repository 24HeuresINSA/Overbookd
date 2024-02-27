import {
  ADHERENT,
  BENEVOLE_CODE,
  EnrolledNewcomer,
  Teams,
  isJoinableTeams,
} from "@overbookd/registration";
import { EnrollNewcomersRepository } from "./enroll-newcomers.repository";
import { PrismaService } from "../../prisma.service";
import {
  DatabaseNewcomer as DatabaseEnrollableAdherent,
  DatabaseTeamCode,
  SELECT_NEWCOMER as SELECT_ADHERENT,
} from "./enroll-newcomers.query";
import { EnrollableAdherent } from "@overbookd/http";

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
        teams: {
          none: {
            team: { code: BENEVOLE_CODE },
          },
        },
      },
      select: SELECT_ADHERENT,
    });
    return adherents.map(formatToEnrollable);
  }
}

function formatToEnrollable(
  newcomer: DatabaseEnrollableAdherent,
): EnrollableAdherent {
  const teams = formatTeamsToJoinableTeams(newcomer.teams);
  return {
    id: newcomer.id,
    firstname: newcomer.firstname,
    lastname: newcomer.lastname,
    email: newcomer.email,
    registeredAt: newcomer.createdAt,
    teams,
  };
}

function formatTeamsToJoinableTeams(teams: DatabaseTeamCode[]): Teams {
  const joinableTeams = teams.map(({ team }) => team.code);
  return isJoinableTeams(joinableTeams) ? joinableTeams : [];
}
