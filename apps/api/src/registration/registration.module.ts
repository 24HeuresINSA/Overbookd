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
      provide: RegisterNewcomer,
      useFactory: (newcomerRepository: PrismaNewcomerRepository) =>
        new RegisterNewcomer(newcomerRepository),
      inject: [PrismaNewcomerRepository],
    },
    {
      provide: RegistrationService,
      useFactory: (
        registerNewcomer: RegisterNewcomer,
        eventStore: DomainEventService,
      ) => new RegistrationService(registerNewcomer, eventStore),
      inject: [RegisterNewcomer, DomainEventService],
    },
  ],
  imports: [PrismaModule, DomainEventModule],
})
export class RegistrationModule {}
