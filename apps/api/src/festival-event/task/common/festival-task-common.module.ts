import { Module } from "@nestjs/common";
import { PrismaModule } from "../../../prisma.module";
import { PrismaCreateFestivalTasks } from "./repository/create-festival-tasks.prisma";
import { PrismaService } from "../../../prisma.service";
import { PrismaPrepareFestivalTasks } from "./repository/prepare-festival-tasks.prisma";
import { PrismaAdherents } from "./repository/adherents.prisma";
import { PrismaFestivalActivities } from "./repository/festival-activities.prisma";
import {
  AskForReviewTask,
  CreateFestivalTask,
  FestivalTaskTranslator,
  PrepareFestivalTask,
  ReviewTask,
  ViewFestivalTask,
} from "@overbookd/festival-event";
import { PrismaRemoveFestivalTasks } from "./repository/remove-festival-tasks.prisma";
import { PrismaViewFestivalTasks } from "./repository/view-festival-task.prisma";
import { PrismaInquiries } from "./repository/inquiries.prisma";
import { PrismaVolunteerConflicts } from "./repository/volunteer-conflicts.prisma";
import { PrismaAskForReview } from "./repository/ask-for-review.prisma";
import { PrismaReviewers } from "./repository/reviewers.prisma";
import { PrismaLocations } from "../../common/repository/locations.prisma";
import { PrismaNotifications } from "../../common/repository/notifications.prisma";
import { PrismaFestivalTasksForReview } from "./repository/review-festival-tasks.prisma";

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
      provide: PrismaAskForReview,
      useFactory: (prisma: PrismaService) => new PrismaAskForReview(prisma),
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
      provide: PrismaVolunteerConflicts,
      useFactory: (prisma: PrismaService) =>
        new PrismaVolunteerConflicts(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaNotifications<"FT">,
      useFactory: (prisma: PrismaService) =>
        new PrismaNotifications<"FT">(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaReviewers,
      useFactory: (prisma: PrismaService) => new PrismaReviewers(prisma),
      inject: [PrismaService],
    },
    {
      provide: FestivalTaskTranslator,
      useFactory: (volunteerConflicts: PrismaVolunteerConflicts) =>
        new FestivalTaskTranslator(volunteerConflicts),
      inject: [PrismaVolunteerConflicts],
    },
    {
      provide: CreateFestivalTask,
      useFactory: async (
        festivalTasks: PrismaCreateFestivalTasks,
        translator: FestivalTaskTranslator,
        prisma: PrismaService,
      ) => {
        const {
          _max: { id: maxId },
        } = await prisma.festivalTask.aggregate({ _max: { id: true } });
        return new CreateFestivalTask(festivalTasks, translator, maxId + 1);
      },
      inject: [
        PrismaCreateFestivalTasks,
        FestivalTaskTranslator,
        PrismaService,
      ],
    },
    {
      provide: PrepareFestivalTask,
      useFactory: (
        festivalTasks: PrismaPrepareFestivalTasks,
        translator: FestivalTaskTranslator,
      ) => new PrepareFestivalTask(festivalTasks, translator),
      inject: [PrismaPrepareFestivalTasks, FestivalTaskTranslator],
    },
    {
      provide: ViewFestivalTask,
      useFactory: (
        festivalTasks: PrismaViewFestivalTasks,
        translator: FestivalTaskTranslator,
      ) => new ViewFestivalTask(festivalTasks, translator),
      inject: [PrismaViewFestivalTasks, FestivalTaskTranslator],
    },
    {
      provide: AskForReviewTask,
      useFactory: (
        tasks: PrismaAskForReview,
        notifications: PrismaNotifications<"FT">,
        reviewers: PrismaReviewers,
        translator: FestivalTaskTranslator,
      ) =>
        new AskForReviewTask({ tasks, notifications, reviewers }, translator),
      inject: [
        PrismaAskForReview,
        PrismaNotifications<"FT">,
        PrismaReviewers,
        FestivalTaskTranslator,
      ],
    },
    {
      provide: PrismaRemoveFestivalTasks,
      useFactory: (prisma: PrismaService) =>
        new PrismaRemoveFestivalTasks(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaFestivalTasksForReview,
      useFactory: (prisma: PrismaService) =>
        new PrismaFestivalTasksForReview(prisma),
      inject: [PrismaService],
    },
    {
      provide: ReviewTask,
      useFactory: (
        festivalTasks: PrismaFestivalTasksForReview,
        translator: FestivalTaskTranslator,
      ) => new ReviewTask(festivalTasks, translator),
      inject: [PrismaFestivalTasksForReview, FestivalTaskTranslator],
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
    AskForReviewTask,
    PrismaRemoveFestivalTasks,
    ReviewTask,
  ],
})
export class FestivalTaskCommonModule {}
