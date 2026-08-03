import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { Subject, filter, takeUntil } from "rxjs";
import { DomainEventService } from "../domain-event/domain-event.service";
import { TeamLeft, TeamsJoined } from "@overbookd/access-manager";
import { HARD } from "@overbookd/team-constants";
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
export class ZitadelRoleService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ZitadelRoleService.name);
  private readonly destroy$ = new Subject<void>();

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

  onModuleInit(): void {
    this.eventStore.teamsJoined
      .pipe(filter(joinedOrganizers), takeUntil(this.destroy$))
      .subscribe((event) => this.addZitadelOrganizerRoles(event));

    this.eventStore.teamLeft
      .pipe(filter(leftOrganizers), takeUntil(this.destroy$))
      .subscribe((event) => this.removeZitadelOrganizerRoles(event));
  }

  onModuleDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async getZitadelId(id: number): Promise<string | null> {
    const { zitadelId } = await this.prisma.user.findUnique({
      where: { id },
      select: { zitadelId: true },
    });
    return zitadelId;
  }

  private async addZitadelOrganizerRoles({ data: { member } }: TeamsJoined) {
    const zitadelId = await this.getZitadelId(member.id);
    if (!zitadelId) {
      this.logger.error(
        `Can not grant organizer roles to user #${member.id}. They do not have a Zitadel account.`,
      );
      return;
    }

    this.organizersRoles.forEach(({ role, projectId }) => {
      if (!projectId) {
        this.logger.warn(
          `Can not grant role ${role} to user #${member.id} (${zitadelId}). Project id not set.`,
        );
        return;
      }

      this.zitadelService
        .addZitadelRoleIfNotGranted(zitadelId, role, projectId)
        .then(() =>
          this.logger.log(
            `Role ${role} successfully granted to user #${member.id} (${zitadelId}) in project ${projectId}.`,
          ),
        )
        .catch(() =>
          this.logger.error(
            `An error happened while granting role ${role} to user #${member.id} (${zitadelId}) in project ${projectId}.`,
          ),
        );
    });
  }

  private async removeZitadelOrganizerRoles({ data: { member } }: TeamLeft) {
    const zitadelId = await this.getZitadelId(member.id);
    if (!zitadelId) {
      this.logger.error(
        `Can not remove organizer roles to user #${member.id}. They do not have a Zitadel account.`,
      );
      return;
    }

    this.organizersRoles.forEach(({ role, projectId }) => {
      if (!projectId) {
        this.logger.warn(
          `Can not remove role ${role} from user #${member.id} (${zitadelId}). Project id not set.`,
        );
        return;
      }

      this.zitadelService
        .removeZitadelRoleIfGranted(zitadelId, role, projectId)
        .then(() =>
          this.logger.log(
            `Role ${role} successfully removed from user #${member.id} (${zitadelId}) in project ${projectId}.`,
          ),
        )
        .catch(() =>
          this.logger.error(
            `An error happened while removing role ${role} from user #${member.id} (${zitadelId}) in project ${projectId}.`,
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
