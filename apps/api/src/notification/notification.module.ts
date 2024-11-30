import { Module } from "@nestjs/common";
import { RegisterNewcomer } from "@overbookd/registration";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { DomainEventService } from "../domain-event/domain-event.service";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { RegistrationModule } from "../registration/index/registration.module";
import { LiveNotificationController } from "./live/live-notification.controller";
import { LiveNotificationModule } from "./live/live-notification.module";
import { PrismaNotificationRepository } from "./notification-repository.prisma";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";

@Module({
  controllers: [NotificationController, LiveNotificationController],
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
  imports: [
    PrismaModule,
    DomainEventModule,
    RegistrationModule,
    LiveNotificationModule,
  ],
})
export class NotificationModule {}
