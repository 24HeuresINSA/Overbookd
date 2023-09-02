import { Module } from "@nestjs/common";
import { RegistrationController } from "./registration.controller";
import { RegistrationService } from "./registration.service";
import { RegisterNewcomer } from "@overbookd/registration";
import { PrismaService } from "../prisma.service";
import { PrismaNewcomerRepository } from "./repository/newcomer-repository.prisma";
import { PrismaModule } from "../prisma.module";
import { HashingUtilsService } from "../hashing-utils/hashing-utils.service";

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
      useFactory: (registerNewcomer: RegisterNewcomer) =>
        new RegistrationService(registerNewcomer),
      inject: [RegisterNewcomer],
    },
  ],
  imports: [PrismaModule],
})
export class RegistrationModule {}
