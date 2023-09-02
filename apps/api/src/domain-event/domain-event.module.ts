import { Module } from "@nestjs/common";
import { DomainEventService } from "./domain-event.service";

@Module({
  providers: [
    {
      provide: DomainEventService,
      useFactory: () => DomainEventService.init(),
    },
  ],
  exports: [DomainEventService],
})
export class DomainEventModule {}
