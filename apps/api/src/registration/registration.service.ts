import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import {
  EnrollNewcomersForm,
  FulfilledRegistration,
  IDefineANewcomer,
  NewcomerRegisteredEvent,
  RegisterNewcomer,
  Registree,
  TeamCode,
  VOLUNTEER,
  ADHERENT,
  Teams,
  isJoinableTeams,
} from "@overbookd/registration";
import { jwtConstants } from "../authentication/constants";
import { InviteNewAdherents } from "@overbookd/registration";
import { BadRequestException } from "@nestjs/common";
import { DomainEventService } from "../domain-event/domain-event.service";
import { SELECT_USER_TEAMS } from "../user/user.query";

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

    const newcomers = await this.prisma.user.findMany({
      orderBy: { id: "asc" },
      where: {
        isDeleted: false,
        teams: {
          none: {
            team: { code: "benevole" },
          },
        },
        createdAt: { gte: minRegisterDate },
      },
      select: SELECT_NEWCOMER,
    });
    return newcomers.map(RegistrationService.formatToNewcomer);
  }

  async enrollNewcomers({
    newcomers,
    team,
  }: EnrollNewcomersForm): Promise<void> {
    const allRequests = newcomers.map(({ id }) =>
      this.prisma.user.update({
        where: { id },
        data: {
          teams: {
            create: [
              { team: { connect: { code: team } } },
              { team: { connect: { code: "benevole" } } },
            ],
          },
        },
      }),
    );
    await this.prisma.$transaction(allRequests);
  }

  private static formatToNewcomer(
    newcomer: DatabaseNewcomer,
  ): IDefineANewcomer {
    const teams = RegistrationService.formatTeamsToJoinableTeams(
      newcomer.teams,
    );
    return {
      id: newcomer.id,
      firstname: newcomer.firstname,
      lastname: newcomer.lastname,
      registeredAt: newcomer.createdAt,
      teams,
    };
  }

  private static formatTeamsToJoinableTeams(teams: DatabaseTeamCode[]): Teams {
    const joinableTeams = teams.map(({ team }) => team.code);
    return isJoinableTeams(joinableTeams) ? joinableTeams : [];
  }
}
