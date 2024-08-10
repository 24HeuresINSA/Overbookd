import { Module } from "@nestjs/common";
import { CharismaEventController } from "./charisma-event.controller";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { CharismaEventService } from "./charisma-event.service";
import { PrismaManageCharismaEventParticipations } from "./repository/manage-participations.prisma";
import { CharismaEvent } from "@overbookd/charisma";
import { PrismaCharismaEventPotentialParticipants } from "./repository/potential-participants.prisma";
import { PrismaViewCharismaEventParticipations } from "./repository/view-participations.prisma";

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
      provide: PrismaManageCharismaEventParticipations,
      useFactory: (prisma: PrismaService) =>
        new PrismaManageCharismaEventParticipations(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaViewCharismaEventParticipations,
      useFactory: (prisma: PrismaService) =>
        new PrismaViewCharismaEventParticipations(prisma),
      inject: [PrismaService],
    },
    {
      provide: CharismaEvent,
      useFactory: (participants: PrismaManageCharismaEventParticipations) => {
        return new CharismaEvent(participants);
      },
      inject: [PrismaManageCharismaEventParticipations],
    },
    {
      provide: CharismaEventService,
      useFactory: (
        charismaEvent: CharismaEvent,
        potentialParticipants: PrismaCharismaEventPotentialParticipants,
        viewParticipations: PrismaViewCharismaEventParticipations,
      ) => {
        return new CharismaEventService(charismaEvent, {
          potentialParticipants,
          viewParticipations,
        });
      },
      inject: [
        CharismaEvent,
        PrismaCharismaEventPotentialParticipants,
        PrismaViewCharismaEventParticipations,
      ],
    },
  ],
  imports: [PrismaModule],
  exports: [CharismaEventService],
})
export class CharismaEventModule {}
