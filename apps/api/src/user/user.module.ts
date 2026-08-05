import { Module } from "@nestjs/common";
import { BreakPeriods } from "@overbookd/assignment";
import { PrismaService } from "../prisma.service";
import { FileService } from "../utils/file.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { RegistrationModule } from "../registration/index/registration.module";
import { PrismaModule } from "../prisma.module";
import { PreferenceController } from "./preference/preference.controller";
import { PrismaPreferences } from "./preference/repository/preferences.prisma";
import { PreferenceService } from "./preference/preference.service";
import { PrismaBreaks } from "./planning/repository/breaks.prisma";
import { PrismaPlanningVolunteers } from "./planning/repository/planning-volunteers.prisma";
import { PlanningModule } from "./planning/planning.module";
import { PlanningController } from "./planning/planning.controller";
import { TeamService } from "../team/team.service";
import { AccessManagerModule } from "../access-manager/access-manager.module";
import { ZitadelService } from "./zitadel.service";
import { ZitadelRoleService } from "./zitadel-roles.service";
import { DomainEventService } from "../domain-event/domain-event.service";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { PrismaMemberRepository } from "./repository/member-repository.prisma";
import { ForgetMember } from "@overbookd/registration";

@Module({
  imports: [
    PlanningModule,
    RegistrationModule,
    PrismaModule,
    AccessManagerModule,
    DomainEventModule,
  ],
  controllers: [UserController, PreferenceController, PlanningController],
  providers: [
    {
      provide: PrismaPreferences,
      useFactory: (prisma: PrismaService) => new PrismaPreferences(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaBreaks,
      useFactory: (prisma: PrismaService) => new PrismaBreaks(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaPlanningVolunteers,
      useFactory: (prisma: PrismaService) =>
        new PrismaPlanningVolunteers(prisma),
      inject: [PrismaService],
    },
    {
      provide: PreferenceService,
      useFactory: (preferences: PrismaPreferences) =>
        new PreferenceService(preferences),
      inject: [PrismaPreferences],
    },
    {
      provide: BreakPeriods,
      useFactory: (breaks: PrismaBreaks) => new BreakPeriods(breaks),
      inject: [PrismaBreaks],
    },
    {
      provide: PrismaMemberRepository,
      useFactory: (prisma: PrismaService) => new PrismaMemberRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: ForgetMember,
      useFactory: (members: PrismaMemberRepository) =>
        new ForgetMember(members),
      inject: [PrismaMemberRepository],
    },
    ZitadelService,
    {
      provide: UserService,
      useFactory: (
        prisma: PrismaService,
        zitadelService: ZitadelService,
        forget: ForgetMember,
      ) => new UserService(prisma, zitadelService, forget),
      inject: [PrismaService, ZitadelService, ForgetMember],
    },
    FileService,
    TeamService,
    {
      provide: ZitadelRoleService,
      useFactory: (
        eventStore: DomainEventService,
        prisma: PrismaService,
        zitadelService: ZitadelService,
      ) => new ZitadelRoleService(eventStore, prisma, zitadelService),
      inject: [DomainEventService, PrismaService, ZitadelService],
    },
  ],
  exports: [UserService],
})
export class UserModule {}
