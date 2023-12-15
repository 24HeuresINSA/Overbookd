import { Module } from "@nestjs/common";
import { FestivalActivityController } from "./festival-activity.controller";
import { FestivalActivityService } from "./festival-activity.service";
import { PrismaAdherents } from "./repository/adherents.prisma";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import {
  AskForReview,
  CreateFestivalActivity,
  PrepareFestivalActivity,
  Reviewing,
} from "@overbookd/festival-activity";
import { PrismaPrepareFestivalActivities } from "./repository/prepare-festival-activities.prisma";
import { PrismaCreateFestivalActivities } from "./repository/create-festival-activities.prisma";
import { PrismaLocations } from "./repository/locations.prisma";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { DomainEventService } from "../domain-event/domain-event.service";
import { PrismaInquiries } from "./repository/inquiries.prisma";
import { PrismaAskForReview } from "./repository/ask-for-review.prisma";
import { PrismaNotifications } from "./repository/notifications.prisma";
import { PrismaReviewingFestivalActivities } from "./repository/reviewing-festival-activities.prisma";
import { PrismaCatalogSignages } from "./repository/catalog-signages.prisma";
import { StatisticsModule } from "../statistics/statistics.module";

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
      provide: Reviewing,
      useFactory: (festivalActivities: PrismaReviewingFestivalActivities) =>
        new Reviewing(festivalActivities),
      inject: [PrismaReviewingFestivalActivities],
    },
    {
      provide: FestivalActivityService,
      useFactory: (
        adherents: PrismaAdherents,
        locations: PrismaLocations,
        inquiries: PrismaInquiries,
        catalogSignages: PrismaCatalogSignages,
        create: CreateFestivalActivity,
        prepare: PrepareFestivalActivity,
        askForReview: AskForReview,
        reviewing: Reviewing,
        eventStore: DomainEventService,
      ) =>
        new FestivalActivityService(
          adherents,
          locations,
          inquiries,
          catalogSignages,
          create,
          prepare,
          askForReview,
          reviewing,
          eventStore,
        ),
      inject: [
        PrismaAdherents,
        PrismaLocations,
        PrismaInquiries,
        PrismaCatalogSignages,
        CreateFestivalActivity,
        PrepareFestivalActivity,
        AskForReview,
        Reviewing,
        DomainEventService,
      ],
    },
  ],
  imports: [PrismaModule, DomainEventModule, StatisticsModule],
})
export class FestivalActivityModule {}
