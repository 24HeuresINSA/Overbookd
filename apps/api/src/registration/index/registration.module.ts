import { Module } from "@nestjs/common";
import { RegistrationController } from "./registration.controller";
import { RegistrationService } from "./registration.service";
import { RegisterNewcomer } from "@overbookd/registration";
import { PrismaService } from "../../prisma.service";
import { PrismaNewcomerRepository } from "./repository/newcomer-repository.prisma";
import { PrismaModule } from "../../prisma.module";
import { HashingUtilsService } from "../../hashing-utils/hashing-utils.service";
import { DomainEventModule } from "../../domain-event/domain-event.module";
import { DomainEventService } from "../../domain-event/domain-event.service";
import { PrismaMemberRepository } from "./repository/member-repository.prisma";
import { ForgetMember } from "@overbookd/registration";
import { PrismaNotificationRepository } from "./repository/notification-repository.prisma";
import { VolunteerAvailabilityModule } from "../../volunteer-availability/volunteer-availability.module";
import { VolunteerAvailabilityService } from "../../volunteer-availability/volunteer-availability.service";

@Module({
  controllers: [RegistrationController],
  providers: [
    {
      provide: PrismaNewcomerRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaNewcomerRepository(prisma, new HashingUtilsService()),
      inject: [PrismaService],
    },
    {
      provide: PrismaNotificationRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaNotificationRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: RegisterNewcomer,
      useFactory: (
        newcomers: PrismaNewcomerRepository,
        notifications: PrismaNotificationRepository,
      ) => new RegisterNewcomer(newcomers, notifications),
      inject: [PrismaNewcomerRepository, PrismaNotificationRepository],
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
      provide: RegistrationService,
      useFactory: (
        register: RegisterNewcomer,
        event: DomainEventService,
        forget: ForgetMember,
        availability: VolunteerAvailabilityService,
      ) =>
        new RegistrationService({ register, forget }, { event, availability }),
      inject: [
        RegisterNewcomer,
        DomainEventService,
        ForgetMember,
        VolunteerAvailabilityService,
      ],
    },
  ],
  imports: [PrismaModule, DomainEventModule, VolunteerAvailabilityModule],
  exports: [RegisterNewcomer, ForgetMember],
})
export class RegistrationModule {}
