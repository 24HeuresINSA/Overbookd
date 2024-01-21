import { Module } from "@nestjs/common";
import { FestivalTaskOverviewService } from "./festival-activity-overview.service";
import { PrismaAdherents } from "../common/repository/adherent/adherents.prisma";
import {
  CreateFestivalTask,
  ViewFestivalTask,
} from "@overbookd/festival-event";
import { PrismaRemoveFestivalTasks } from "../common/repository/remove-festival-tasks.prisma";
import { PrismaFestivalActivities } from "../common/repository/festival-activity/festival-activities.prisma";
import { FestivalTaskCommonModule } from "../common/festival-task-common.module";

@Module({
  providers: [
    {
      provide: FestivalTaskOverviewService,
      useFactory: (
        adherents: PrismaAdherents,
        festivalActivities: PrismaFestivalActivities,
        create: CreateFestivalTask,
        view: ViewFestivalTask,
        remove: PrismaRemoveFestivalTasks,
      ) =>
        new FestivalTaskOverviewService(
          adherents,
          festivalActivities,
          create,
          view,
          remove,
        ),
      inject: [
        PrismaAdherents,
        PrismaFestivalActivities,
        CreateFestivalTask,
        ViewFestivalTask,
        PrismaRemoveFestivalTasks,
      ],
    },
  ],
  imports: [FestivalTaskCommonModule],
  exports: [FestivalTaskOverviewService],
})
export class FestivalTaskOverviewModule {}
