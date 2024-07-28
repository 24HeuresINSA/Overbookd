import { Module } from "@nestjs/common";
import { CharismaEventController } from "./charisma-event.controller";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { CharismaEventService } from "./charisma-event.service";
import { PrismaCharismaEventParticipations } from "./repository/charisma-event-participations.prisma";
import { CharismaEvent } from "@overbookd/charisma";

@Module({
  controllers: [CharismaEventController],
  providers: [
    {
      provide: PrismaCharismaEventParticipations,
      useFactory: (prisma: PrismaService) =>
        new PrismaCharismaEventParticipations(prisma),
      inject: [PrismaService],
    },
    {
      provide: CharismaEvent,
      useFactory: (participants: PrismaCharismaEventParticipations) => {
        return new CharismaEvent(participants);
      },
      inject: [PrismaCharismaEventParticipations],
    },
    {
      provide: CharismaEventService,
      useFactory: (charismaEvent: CharismaEvent) => {
        return new CharismaEventService(charismaEvent);
      },
      inject: [CharismaEvent],
    },
  ],
  imports: [PrismaModule],
  exports: [CharismaEventService],
})
export class CharismaEventModule {}
