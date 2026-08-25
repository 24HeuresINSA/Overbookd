import { Module } from "@nestjs/common";
import { RegistrationController } from "./registration.controller";
import { RegistrationService } from "./registration.service";
import { ApplyFor, RegisterNewcomer } from "@overbookd/registration";
import { PrismaService } from "../../prisma.service";
import { PrismaNewcomerRepository } from "./repository/newcomer-repository.prisma";
import { PrismaModule } from "../../prisma.module";
import { HashingUtilsService } from "../../hashing-utils/hashing-utils.service";
import { DomainEventModule } from "../../domain-event/domain-event.module";
import { DomainEventService } from "../../domain-event/domain-event.service";
import { PrismaMemberRepository } from "./repository/member-repository.prisma";
import { ForgetMember } from "@overbookd/registration";
import { ZitadelService } from "../../user/zitadel.service";
import { PrismaUserForRegistrationRepository } from "./repository/user-repository.prisma";
import { PrismaMembershipApplicationForRegistrationRepository } from "./repository/membership-application-repository.prisma";
import { PrismaCandidates } from "../membership-application/common/repository/candidates.prisma";

@Module({
  controllers: [RegistrationController],
  providers: [
    {
      provide: PrismaNewcomerRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaNewcomerRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: RegisterNewcomer,
      useFactory: (newcomers: PrismaNewcomerRepository) =>
        new RegisterNewcomer(newcomers),
      inject: [PrismaNewcomerRepository],
    },
    {
      provide: PrismaMemberRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaMemberRepository(prisma, new HashingUtilsService()),
      inject: [PrismaService],
    },
    {
      provide: ForgetMember,
      useFactory: (members: PrismaMemberRepository) =>
        new ForgetMember(members),
      inject: [PrismaMemberRepository],
    },
    {
      provide: PrismaUserForRegistrationRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaUserForRegistrationRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaMembershipApplicationForRegistrationRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaMembershipApplicationForRegistrationRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaCandidates,
      useFactory: (prisma: PrismaService) => new PrismaCandidates(prisma),
      inject: [PrismaService],
    },
    {
      provide: ApplyFor,
      useFactory: (candidates: PrismaCandidates) => new ApplyFor(candidates),
      inject: [PrismaCandidates],
    },
    ZitadelService,
    {
      provide: RegistrationService,
      useFactory: (
        register: RegisterNewcomer,
        forget: ForgetMember,
        applyFor: ApplyFor,
        event: DomainEventService,
        zitadel: ZitadelService,
        user: PrismaUserForRegistrationRepository,
        application: PrismaMembershipApplicationForRegistrationRepository,
      ) =>
        new RegistrationService(
          { register, forget, applyFor },
          { event, zitadel },
          { user, application },
        ),
      inject: [
        RegisterNewcomer,
        ForgetMember,
        ApplyFor,
        DomainEventService,
        ZitadelService,
        PrismaUserForRegistrationRepository,
        PrismaMembershipApplicationForRegistrationRepository,
      ],
    },
  ],
  imports: [PrismaModule, DomainEventModule],
  exports: [RegisterNewcomer, ForgetMember],
})
export class RegistrationModule {}
