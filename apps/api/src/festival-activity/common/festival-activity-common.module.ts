import { Module } from "@nestjs/common";
import {
  CreateFestivalActivity,
  PrepareFestivalActivity,
  AskForReview,
  Reviewing,
} from "@overbookd/festival-activity";
import { PrismaModule } from "../../prisma.module";
import { PrismaService } from "../../prisma.service";
import { StatisticsModule } from "../../statistics/statistics.module";
import { PrismaAdherents } from "./repository/adherents.prisma";
import { PrismaAskForReview } from "./repository/ask-for-review.prisma";
import { PrismaCatalogSignages } from "./repository/catalog-signages.prisma";
import { PrismaCreateFestivalActivities } from "./repository/create-festival-activities.prisma";
import { PrismaInquiries } from "./repository/inquiries.prisma";
import { PrismaLocations } from "./repository/locations.prisma";
import { PrismaNotifications } from "./repository/notifications.prisma";
import { PrismaPrepareFestivalActivities } from "./repository/prepare-festival-activities.prisma";
import { PrismaPreviews } from "./repository/previews.prisma";
import { PrismaRemoveFestivalActivities } from "./repository/remove-festival-activities.prisma";
import { PrismaReviewingFestivalActivities } from "./repository/reviewing-festival-activities.prisma";

@Module({
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
      provide: PrismaCatalogSignages,
      useFactory: (prisma: PrismaService) => new PrismaCatalogSignages(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaNotifications,
      useFactory: (prisma: PrismaService) => new PrismaNotifications(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaReviewingFestivalActivities,
      useFactory: (prisma: PrismaService) =>
        new PrismaReviewingFestivalActivities(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaPreviews,
      useFactory: (prisma: PrismaService) => new PrismaPreviews(prisma),
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
      provide: AskForReview,
      useFactory: (
        festivalActivities: PrismaAskForReview,
        notifications: PrismaNotifications,
      ) => new AskForReview(festivalActivities, notifications),
      inject: [PrismaAskForReview, PrismaNotifications],
    },
    {
      provide: PrismaRemoveFestivalActivities,
      useFactory: (prisma: PrismaService) =>
        new PrismaRemoveFestivalActivities(prisma),
      inject: [PrismaService],
    },
    {
      provide: Reviewing,
      useFactory: (festivalActivities: PrismaReviewingFestivalActivities) =>
        new Reviewing(festivalActivities),
      inject: [PrismaReviewingFestivalActivities],
    },
  ],
  imports: [PrismaModule, StatisticsModule],
  exports: [
    PrismaAdherents,
    PrismaLocations,
    PrismaInquiries,
    PrismaCatalogSignages,
    CreateFestivalActivity,
    PrepareFestivalActivity,
    AskForReview,
    PrismaRemoveFestivalActivities,
    Reviewing,
    PrismaPreviews,
  ],
})
export class FestivalActivityCommonModule {}
