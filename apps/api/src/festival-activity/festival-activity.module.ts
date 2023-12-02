import { Module } from "@nestjs/common";
import { FestivalActivityController } from "./festival-activity.controller";
import { FestivalActivityService } from "./festival-activity.service";
import { PrismaAdherents } from "./repository/adherents.prisma";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import {
  CreateFestivalActivity,
  PrepareFestivalActivity,
} from "@overbookd/festival-activity";
import { PrismaPrepareFestivalActivities } from "./repository/prepare-festival-activities.prisma";
import { PrismaCreateFestivalActivities } from "./repository/create-festival-activities.prisma";
import { PrismaLocations } from "./repository/locations.prisma";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { DomainEventService } from "../domain-event/domain-event.service";
import { HistoryModule } from "./history/history.module";

@Module({
  controllers: [FestivalActivityController],
  providers: [
    {
      provide: PrismaCreateFestivalActivities,
      useFactory: (prisma: PrismaService) =>
        new PrismaCreateFestivalActivities(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaPrepareFestivalActivities,
      useFactory: (prisma: PrismaService) =>
        new PrismaPrepareFestivalActivities(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaAdherents,
      useFactory: (prisma: PrismaService) => new PrismaAdherents(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaLocations,
      useFactory: (prisma: PrismaService) => new PrismaLocations(prisma),
      inject: [PrismaService],
    },
    {
      provide: CreateFestivalActivity,
      useFactory: async (
        festivalActivities: PrismaCreateFestivalActivities,
        prisma: PrismaService,
      ) => {
        const {
          _max: { id: maxId },
        } = await prisma.festivalActivity.aggregate({ _max: { id: true } });
        return new CreateFestivalActivity(festivalActivities, maxId + 1);
      },
      inject: [PrismaCreateFestivalActivities, PrismaService],
    },
    {
      provide: PrepareFestivalActivity,
      useFactory: (festivalActivities: PrismaPrepareFestivalActivities) =>
        new PrepareFestivalActivity(festivalActivities),
      inject: [PrismaPrepareFestivalActivities],
    },
    {
      provide: FestivalActivityService,
      useFactory: (
        adherents: PrismaAdherents,
        locations: PrismaLocations,
        create: CreateFestivalActivity,
        prepare: PrepareFestivalActivity,
        eventStore: DomainEventService,
      ) =>
        new FestivalActivityService(
          adherents,
          locations,
          create,
          prepare,
          eventStore,
        ),
      inject: [
        PrismaAdherents,
        PrismaLocations,
        CreateFestivalActivity,
        PrepareFestivalActivity,
        DomainEventService,
      ],
    },
  ],
  imports: [PrismaModule, DomainEventModule, HistoryModule],
})
export class FestivalActivityModule {}
