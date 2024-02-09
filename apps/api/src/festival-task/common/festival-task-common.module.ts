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
  ViewFestivalTask,
} from "@overbookd/festival-event";
import { PrismaRemoveFestivalTasks } from "./repository/remove-festival-tasks.prisma";
import { PrismaViewFestivalTasks } from "./repository/view-festival-task.prisma";
import { PrismaLocations } from "./repository/location/locations.prisma";
import { PrismaInquiries } from "./repository/inquiry/inquiries.prisma";
import { PrismaVolunteerConflicts } from "./repository/volunteer-conflicts.prisma";

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
      provide: PrismaViewFestivalTasks,
      useFactory: (prisma: PrismaService) =>
        new PrismaViewFestivalTasks(prisma),
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
      provide: PrismaInquiries,
      useFactory: (prisma: PrismaService) => new PrismaInquiries(prisma),
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
      provide: PrismaVolunteerConflicts,
      useFactory: (prisma: PrismaService) =>
        new PrismaVolunteerConflicts(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrepareFestivalTask,
      useFactory: (
        festivalTasks: PrismaPrepareFestivalTasks,
        volunteerConflicts: PrismaVolunteerConflicts,
      ) => new PrepareFestivalTask(festivalTasks, volunteerConflicts),
      inject: [PrismaPrepareFestivalTasks, PrismaVolunteerConflicts],
    },
    {
      provide: ViewFestivalTask,
      useFactory: (festivalTasks: PrismaViewFestivalTasks) =>
        new ViewFestivalTask(festivalTasks),
      inject: [PrismaViewFestivalTasks],
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
    PrismaLocations,
    PrismaInquiries,
    PrismaFestivalActivities,
    CreateFestivalTask,
    PrepareFestivalTask,
    ViewFestivalTask,
    PrismaRemoveFestivalTasks,
  ],
})
export class FestivalTaskCommonModule {}
