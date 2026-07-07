import { Module } from "@nestjs/common";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { DomainEventService } from "../domain-event/domain-event.service";
import { LiveNotificationService } from "./live-notification.service";
import { LiveNotificationController } from "./live-notification.controller";

@Module({
  controllers: [LiveNotificationController],
  providers: [
    {
      provide: LiveNotificationService,
      useFactory: (eventStore: DomainEventService) => {
        return new LiveNotificationService(eventStore);
      },
      inject: [DomainEventService],
    },
  ],
  imports: [DomainEventModule],
  exports: [LiveNotificationService],
})
export class LiveNotificationModule {}
