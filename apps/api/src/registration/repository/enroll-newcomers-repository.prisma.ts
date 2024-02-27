import {
  ADHERENT,
  BENEVOLE_CODE,
  EnrolledNewcomer,
  IDefineANewcomer,
  Teams,
  isJoinableTeams,
} from "@overbookd/registration";
import { EnrollNewcomersRepository } from "./enroll-newcomers.repository";
import { PrismaService } from "../../prisma.service";
import {
  DatabaseNewcomer,
  DatabaseTeamCode,
  SELECT_NEWCOMER,
} from "./enroll-newcomers.query";

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

  async findEnrollable(): Promise<IDefineANewcomer[]> {
    const newcomers = await this.prisma.user.findMany({
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
      select: SELECT_NEWCOMER,
    });
    return newcomers.map(formatToNewcomer);
  }
}

function formatToNewcomer(newcomer: DatabaseNewcomer): IDefineANewcomer {
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
