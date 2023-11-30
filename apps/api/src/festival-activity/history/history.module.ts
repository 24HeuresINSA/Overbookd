import { Module } from "@nestjs/common";
import { PrismaEvents } from "./repository/events.prisma";
import { PrismaService } from "../../prisma.service";
import { PrismaModule } from "../../prisma.module";
import { HistoryService } from "./history.service";
import { DomainEventService } from "../../domain-event/domain-event.service";
import { DomainEventModule } from "../../domain-event/domain-event.module";

@Module({
  providers: [
    {
      provide: PrismaEvents,
      useFactory: (prisma: PrismaService) => new PrismaEvents(prisma),
      inject: [PrismaService],
    },
    {
      provide: HistoryService,
      useFactory: (events: PrismaEvents, eventStore: DomainEventService) =>
        new HistoryService(events, eventStore),
      inject: [PrismaEvents, DomainEventService],
    },
  ],
  imports: [PrismaModule, DomainEventModule],
  exports: [HistoryService],
})
export class HistoryModule {}
