import { Module } from "@nestjs/common";
import { FestivalTaskOverviewService } from "./festival-activity-overview.service";
import { PrismaAdherents } from "../common/repository/adherent/adherents.prisma";
import {
  CreateFestivalTask,
  PrepareFestivalTask,
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
        creation: CreateFestivalTask,
        preparation: PrepareFestivalTask,
        removal: PrismaRemoveFestivalTasks,
      ) =>
        new FestivalTaskOverviewService(
          adherents,
          festivalActivities,
          creation,
          preparation,
          removal,
        ),
      inject: [
        PrismaAdherents,
        PrismaFestivalActivities,
        CreateFestivalTask,
        PrepareFestivalTask,
        PrismaRemoveFestivalTasks,
      ],
    },
  ],
  imports: [FestivalTaskCommonModule],
  exports: [FestivalTaskOverviewService],
})
export class FestivalTaskOverviewModule {}
