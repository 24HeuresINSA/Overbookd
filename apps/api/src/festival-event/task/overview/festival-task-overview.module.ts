import { Module } from "@nestjs/common";
import { FestivalTaskOverviewService } from "./festival-task-overview.service";
import { PrismaAdherents } from "../common/repository/adherents.prisma";
import {
  CreateFestivalTask,
  RemoveFestivalTask,
  ViewFestivalTask,
} from "@overbookd/festival-event";
import { PrismaFestivalActivities } from "../common/repository/festival-activities.prisma";
import { FestivalTaskCommonModule } from "../common/festival-task-common.module";
import { DomainEventService } from "../../../domain-event/domain-event.service";
import { DomainEventModule } from "../../../domain-event/domain-event.module";

@Module({
  providers: [
    {
      provide: FestivalTaskOverviewService,
      useFactory: (
        create: CreateFestivalTask,
        view: ViewFestivalTask,
        remove: RemoveFestivalTask,
        adherents: PrismaAdherents,
        festivalActivities: PrismaFestivalActivities,
        eventStore: DomainEventService,
      ) =>
        new FestivalTaskOverviewService(
          { create, view, remove },
          { adherents, festivalActivities },
          eventStore,
        ),
      inject: [
        CreateFestivalTask,
        ViewFestivalTask,
        RemoveFestivalTask,
        PrismaAdherents,
        PrismaFestivalActivities,
        DomainEventService,
      ],
    },
  ],
  imports: [FestivalTaskCommonModule, DomainEventModule],
  exports: [FestivalTaskOverviewService],
})
export class FestivalTaskOverviewModule {}
