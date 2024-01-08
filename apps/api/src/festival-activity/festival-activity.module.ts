import { Module } from "@nestjs/common";
import { FestivalActivityController } from "./festival-activity.controller";
import { FestivalActivityService } from "./festival-activity.service";
import { PrismaModule } from "../prisma.module";
import {
  AskForReview,
  CreateFestivalActivity,
  PrepareFestivalActivity,
  Reviewing,
} from "@overbookd/festival-activity";
import { FestivalActivityCommonModule } from "./common/festival-activity-common.module";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { DomainEventService } from "../domain-event/domain-event.service";
import { StatisticsModule } from "../statistics/statistics.module";
import { PrismaCatalogSignages } from "./common/repository/catalog-signages.prisma";
import { PrismaInquiries } from "./common/repository/inquiries.prisma";
import { PrismaLocations } from "./common/repository/locations.prisma";
import { PrismaPreviews } from "./common/repository/previews.prisma";
import { PrismaRemoveFestivalActivities } from "./common/repository/remove-festival-activities.prisma";
import { PrismaAdherents } from "./common/repository/adherents.prisma";
import { GeneralSectionController } from "./sections/general-section/general-section.controller";
import { GeneralSectionModule } from "./sections/general-section/general-section.module";
import { InChargeSectionController } from "./sections/in-charge-section/in-charge-section.controller";
import { InChargeSectionModule } from "./sections/in-charge-section/in-charge-section.module";

@Module({
  controllers: [
    FestivalActivityController,
    GeneralSectionController,
    InChargeSectionController,
  ],
  providers: [
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
        remove: PrismaRemoveFestivalActivities,
        reviewing: Reviewing,
        eventStore: DomainEventService,
        previews: PrismaPreviews,
      ) =>
        new FestivalActivityService(
          adherents,
          locations,
          inquiries,
          catalogSignages,
          create,
          prepare,
          askForReview,
          remove,
          reviewing,
          eventStore,
          previews,
        ),
      inject: [
        PrismaAdherents,
        PrismaLocations,
        PrismaInquiries,
        PrismaCatalogSignages,
        CreateFestivalActivity,
        PrepareFestivalActivity,
        AskForReview,
        PrismaRemoveFestivalActivities,
        Reviewing,
        DomainEventService,
        PrismaPreviews,
      ],
    },
  ],
  imports: [
    PrismaModule,
    DomainEventModule,
    StatisticsModule,
    FestivalActivityCommonModule,
    GeneralSectionModule,
    InChargeSectionModule,
  ],
})
export class FestivalActivityModule {}
