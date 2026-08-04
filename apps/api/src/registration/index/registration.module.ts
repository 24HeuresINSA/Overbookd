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
import { UserService } from "../../user/user.service";
import { ZitadelService } from "../../user/zitadel.service";

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
    UserService,
    ZitadelService,
    {
      provide: RegistrationService,
      useFactory: (
        register: RegisterNewcomer,
        forget: ForgetMember,
        event: DomainEventService,
        user: UserService,
        zitadel: ZitadelService,
      ) =>
        new RegistrationService({ register, forget }, { event, user, zitadel }),
      inject: [
        RegisterNewcomer,
        ForgetMember,
        DomainEventService,
        UserService,
        ZitadelService,
      ],
    },
  ],
  imports: [PrismaModule, DomainEventModule],
  exports: [RegisterNewcomer, ForgetMember],
})
export class RegistrationModule {}
