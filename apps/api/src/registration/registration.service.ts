import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import {
  ADHERENT,
  FulfilledRegistration,
  IDefineANewcomer,
  NewcomerRegisteredEvent,
  RegisterNewcomer,
  Registree,
  TeamCode,
  VOLUNTEER,
} from "@overbookd/registration";
import { jwtConstants } from "../authentication/constants";
import { InviteNewAdherents } from "@overbookd/registration";
import { BadRequestException } from "@nestjs/common";
import { DomainEventService } from "../domain-event/domain-event.service";
import { SELECT_USER_TEAMS } from "../user/user.query";
import { NewcomerToEnroll, NewcomerTeams } from "./registration.model";

const SELECT_NEWCOMER = {
  id: true,
  firstname: true,
  lastname: true,
  createdAt: true,
  ...SELECT_USER_TEAMS,
};

interface DatabaseNewcomer {
  id: number;
  firstname: string;
  lastname: string;
  createdAt: Date;
  teams: DatabaseTeamCode[];
}

type DatabaseTeamCode = { team: { code: TeamCode } };

@Injectable()
export class RegistrationService {
  constructor(
    private prisma: PrismaService,
    private readonly registerNewcomer: RegisterNewcomer,
    private readonly eventStore: DomainEventService,
  ) {}

  async register(
    fulfilledRegistration: FulfilledRegistration,
    token?: string,
  ): Promise<void> {
    const isValidRegistration = this.checkInvitationValidity(token);

    if (!isValidRegistration) {
      throw new BadRequestException("Le lien d'invitation a exipré");
    }

    const registree = await this.registerNewcomer.fromRegisterForm(
      fulfilledRegistration,
    );

    this.publishNewcomerRegisteredEvent(registree, token);
  }

  private publishNewcomerRegisteredEvent(registree: Registree, token?: string) {
    const membership = token ? ADHERENT : VOLUNTEER;

    this.eventStore.publish({
      domain: "registration",
      event: NewcomerRegisteredEvent.create(registree, membership),
    });
  }

  private checkInvitationValidity(token?: string) {
    if (!token) return true;

    return InviteNewAdherents.isInvitationValid({
      token,
      secret: jwtConstants.secret,
    });
  }

  invite(): URL {
    const domain = process.env.DOMAIN;
    const secret = jwtConstants.secret;
    return InviteNewAdherents.byLink({ domain, secret });
  }

  async getNewcomers(): Promise<IDefineANewcomer[]> {
    const now = new Date();
    const minRegisterDate = new Date(now.setDate(now.getDate() - 60));

    const newComers = await this.prisma.user.findMany({
      orderBy: { id: "asc" },
      where: {
        isDeleted: false,
        teams: {
          none: {
            team: {
              permissions: { some: { permissionName: "validated-user" } },
            },
          },
        },
        createdAt: { gte: minRegisterDate },
      },
      select: SELECT_NEWCOMER,
    });
    return newComers.map(this.formatToNewcomer);
  }

  async enrollNewcomers(
    team: TeamCode,
    newcomers: NewcomerToEnroll[],
  ): Promise<void> {
    await this.prisma.$transaction([
      ...newcomers.map((newcomer) =>
        this.prisma.user.update({
          where: { id: newcomer.id },
          data: {
            teams: {
              create: {
                team: { connect: { code: team } },
              },
            },
          },
        }),
      ),
    ]);
  }

  private formatToNewcomer(newcomer: DatabaseNewcomer): IDefineANewcomer {
    const teams = this.formatTeamsToJoinableTeams(newcomer.teams);
    return {
      id: newcomer.id,
      firstName: newcomer.firstname,
      lastName: newcomer.lastname,
      registeredAt: newcomer.createdAt,
      teams,
    };
  }

  private formatTeamsToJoinableTeams(teams: DatabaseTeamCode[]): NewcomerTeams {
    const teamCodes = teams.map(({ team }) => team.code);

    if (teamCodes.length === 0) return [];
    if (teamCodes.length === 1) return [teamCodes[0]];
    return [teamCodes[0], teamCodes[1]];
  }
}
