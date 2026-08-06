import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { filter } from "rxjs";
import { DomainEventService } from "../domain-event/domain-event.service";
import { TeamLeft, TeamsJoined } from "@overbookd/access-manager";
import { HARD } from "@overbookd/team-code";
import { ZitadelService } from "./zitadel.service";
import { PrismaService } from "../prisma.service";
import {
  OidcRole,
  oidcRoles,
  overviewOidcRoles,
  wikiOidcRoles,
} from "@overbookd/oidc";

type RoleWithProject = { role: OidcRole; projectId: string };

@Injectable()
export class ZitadelRoleService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ZitadelRoleService.name);

  private organizersRoles: RoleWithProject[] = [
    {
      role: wikiOidcRoles.EDITOR,
      projectId: process.env.ZITADEL_WIKI_PROJECT_ID,
    },
    {
      role: overviewOidcRoles.VIEWER,
      projectId: process.env.ZITADEL_OVERVIEW_PROJECT_ID,
    },
    {
      role: oidcRoles.USER,
      projectId: process.env.ZITADEL_OVERBOOKD_PREPROD_PROJECT_ID,
    },
    {
      role: oidcRoles.USER,
      projectId: process.env.ZITADEL_OVERBOOKD_CTMA_PROJECT_ID,
    },
  ];

  constructor(
    private readonly eventStore: DomainEventService,
    private readonly prisma: PrismaService,
    private readonly zitadelService: ZitadelService,
  ) {}

  onApplicationBootstrap(): void {
    this.eventStore.teamsJoined
      .pipe(filter(joinedOrganizers))
      .subscribe(({ data: { member } }) =>
        this.addZitadelOrganizerRoles(member.id),
      );

    this.eventStore.organizerEnrolled.subscribe(({ data: { candidate } }) =>
      this.addZitadelOrganizerRoles(candidate.id),
    );

    this.eventStore.teamLeft
      .pipe(filter(leftOrganizers))
      .subscribe(({ data: { member } }) =>
        this.removeZitadelOrganizerRoles(member.id),
      );
  }

  private async getZitadelId(id: number): Promise<string | null> {
    const { zitadelId } = await this.prisma.user.findUnique({
      where: { id },
      select: { zitadelId: true },
    });
    return zitadelId;
  }

  private async addZitadelOrganizerRoles(id: number) {
    const zitadelId = await this.getZitadelId(id);
    if (!zitadelId) {
      this.logger.error(
        `Cannot grant organizer roles to user #${id}. They do not have a Zitadel account.`,
      );
      return;
    }

    this.organizersRoles.forEach(({ role, projectId }) => {
      if (!projectId) {
        this.logger.warn(
          `Cannot grant role ${role} to user #${id} (${zitadelId}). Project id not set.`,
        );
        return;
      }

      this.zitadelService
        .addZitadelRoleIfNotGranted(zitadelId, role, projectId)
        .then(() =>
          this.logger.log(
            `Role ${role} successfully granted to user #${id} (${zitadelId}) in project ${projectId}.`,
          ),
        )
        .catch(() =>
          this.logger.error(
            `An error happened while granting role ${role} to user #${id} (${zitadelId}) in project ${projectId}.`,
          ),
        );
    });
  }

  private async removeZitadelOrganizerRoles(id: number) {
    const zitadelId = await this.getZitadelId(id);
    if (!zitadelId) {
      this.logger.error(
        `Cannot remove organizer roles to user #${id}. They do not have a Zitadel account.`,
      );
      return;
    }

    this.organizersRoles.forEach(({ role, projectId }) => {
      if (!projectId) {
        this.logger.warn(
          `Cannot remove role ${role} from user #${id} (${zitadelId}). Project id not set.`,
        );
        return;
      }

      this.zitadelService
        .removeZitadelRoleIfGranted(zitadelId, role, projectId)
        .then(() =>
          this.logger.log(
            `Role ${role} successfully removed from user #${id} (${zitadelId}) in project ${projectId}.`,
          ),
        )
        .catch(() =>
          this.logger.error(
            `An error happened while removing role ${role} from user #${id} (${zitadelId}) in project ${projectId}.`,
          ),
        );
    });
  }
}

function joinedOrganizers({ data: { teams } }: TeamsJoined): boolean {
  return teams.includes(HARD);
}

function leftOrganizers({ data: { team } }: TeamLeft): boolean {
  return team === HARD;
}
