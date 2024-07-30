import { Module } from "@nestjs/common";
import { CharismaEventController } from "./charisma-event.controller";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { CharismaEventService } from "./charisma-event.service";
import { PrismaCharismaEventParticipations } from "./repository/participations.prisma";
import { CharismaEvent } from "@overbookd/charisma";
import { PrismaCharismaEventPotentialParticipants } from "./repository/potential-participants.prisma";

@Module({
  controllers: [CharismaEventController],
  providers: [
    {
      provide: PrismaCharismaEventPotentialParticipants,
      useFactory: (prisma: PrismaService) =>
        new PrismaCharismaEventPotentialParticipants(prisma),
      inject: [PrismaService],
    },
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
      useFactory: (
        charismaEvent: CharismaEvent,
        potentialParticipants: PrismaCharismaEventPotentialParticipants,
      ) => {
        return new CharismaEventService(charismaEvent, potentialParticipants);
      },
      inject: [CharismaEvent, PrismaCharismaEventPotentialParticipants],
    },
  ],
  imports: [PrismaModule],
  exports: [CharismaEventService],
})
export class CharismaEventModule {}
