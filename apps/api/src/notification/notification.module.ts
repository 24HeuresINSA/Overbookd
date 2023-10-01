import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { PrismaNotificationRepository } from "./notification-repository.prisma";
import { PrismaService } from "../prisma.service";
import { PrismaModule } from "../prisma.module";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { DomainEventService } from "../domain-event/domain-event.service";
import { RegistrationModule } from "../registration/registration.module";
import { RegisterNewcomer } from "@overbookd/registration";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../authentication/constants";

@Module({
  controllers: [NotificationController],
  providers: [
    {
      provide: PrismaNotificationRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaNotificationRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: NotificationService,
      useFactory: (
        notifications: PrismaNotificationRepository,
        events: DomainEventService,
        register: RegisterNewcomer,
        jwt: JwtService,
      ) => new NotificationService(notifications, events, register, jwt),
      inject: [
        PrismaNotificationRepository,
        DomainEventService,
        RegisterNewcomer,
        JwtService,
      ],
    },
  ],
  imports: [
    PrismaModule,
    DomainEventModule,
    RegistrationModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: "24h",
      },
    }),
  ],
})
export class NotificationModule {}
