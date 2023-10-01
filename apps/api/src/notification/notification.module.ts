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
      ) => new NotificationService(notifications, events, register),
      inject: [
        PrismaNotificationRepository,
        DomainEventService,
        RegisterNewcomer,
      ],
    },
  ],
  imports: [PrismaModule, DomainEventModule, RegistrationModule],
})
export class NotificationModule {}
