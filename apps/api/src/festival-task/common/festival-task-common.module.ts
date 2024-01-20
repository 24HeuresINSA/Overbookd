import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma.module";
import { PrismaCreateFestivalTasks } from "./repository/create-festival-tasks.prisma";
import { PrismaService } from "../../prisma.service";
import { PrismaPrepareFestivalTasks } from "./repository/prepare-festival-tasks.prisma";
import { PrismaAdherents } from "./repository/adherent/adherents.prisma";
import { PrismaFestivalActivities } from "./repository/festival-activity/festival-activities.prisma";
import {
  CreateFestivalTask,
  PrepareFestivalTask,
} from "@overbookd/festival-event";
import { PrismaRemoveFestivalTasks } from "./repository/remove-festival-tasks.prisma";

@Module({
  providers: [
    {
      provide: PrismaCreateFestivalTasks,
      useFactory: (prisma: PrismaService) =>
        new PrismaCreateFestivalTasks(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaPrepareFestivalTasks,
      useFactory: (prisma: PrismaService) =>
        new PrismaPrepareFestivalTasks(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaAdherents,
      useFactory: (prisma: PrismaService) => new PrismaAdherents(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaFestivalActivities,
      useFactory: (prisma: PrismaService) =>
        new PrismaFestivalActivities(prisma),
      inject: [PrismaService],
    },
    {
      provide: CreateFestivalTask,
      useFactory: async (
        festivalTasks: PrismaCreateFestivalTasks,
        prisma: PrismaService,
      ) => {
        const {
          _max: { id: maxId },
        } = await prisma.festivalTask.aggregate({ _max: { id: true } });
        return new CreateFestivalTask(festivalTasks, maxId + 1);
      },
      inject: [PrismaCreateFestivalTasks, PrismaService],
    },
    {
      provide: PrepareFestivalTask,
      useFactory: (festivalTasks: PrismaPrepareFestivalTasks) =>
        new PrepareFestivalTask(festivalTasks),
      inject: [PrismaPrepareFestivalTasks],
    },
    {
      provide: PrismaRemoveFestivalTasks,
      useFactory: (prisma: PrismaService) =>
        new PrismaRemoveFestivalTasks(prisma),
      inject: [PrismaService],
    },
  ],
  imports: [PrismaModule],
  exports: [
    PrismaAdherents,
    CreateFestivalTask,
    PrepareFestivalTask,
    PrismaRemoveFestivalTasks,
  ],
})
export class FestivalTaskCommonModule {}
