import { Module } from "@nestjs/common";
import { RegistrationController } from "./registration.controller";
import { RegistrationService } from "./registration.service";
import { RegisterNewcomer } from "@overbookd/registration";
import { PrismaService } from "../prisma.service";
import { PrismaNewcomerRepository } from "./repository/newcomer-repository.prisma";
import { PrismaModule } from "../prisma.module";
import { HashingUtilsService } from "../hashing-utils/hashing-utils.service";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { DomainEventService } from "../domain-event/domain-event.service";
import { PrismaEnrollNewcomersRepository } from "./repository/enroll-newcomers-repository.prisma";
import { PrismaMemberRepository } from "./repository/member-repository.prisma";
import { ForgetMember } from "@overbookd/registration";

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
      provide: PrismaEnrollNewcomersRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaEnrollNewcomersRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: RegisterNewcomer,
      useFactory: (newcomerRepository: PrismaNewcomerRepository) =>
        new RegisterNewcomer(newcomerRepository),
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
      provide: RegistrationService,
      useFactory: (
        enrollNewcomers: PrismaEnrollNewcomersRepository,
        registerNewcomer: RegisterNewcomer,
        eventStore: DomainEventService,
        forgetMember: ForgetMember,
      ) =>
        new RegistrationService(
          enrollNewcomers,
          registerNewcomer,
          eventStore,
          forgetMember,
        ),
      inject: [
        PrismaEnrollNewcomersRepository,
        RegisterNewcomer,
        DomainEventService,
        ForgetMember,
      ],
    },
  ],
  imports: [PrismaModule, DomainEventModule],
})
export class RegistrationModule {}
