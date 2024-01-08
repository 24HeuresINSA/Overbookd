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
import { PrismaInquiries } from "./common/repository/inquiries.prisma";
import { PrismaLocations } from "./common/repository/locations.prisma";
import { PrismaPreviews } from "./common/repository/previews.prisma";
import { PrismaRemoveFestivalActivities } from "./common/repository/remove-festival-activities.prisma";
import { PrismaAdherents } from "./common/repository/adherents.prisma";
import { GeneralSectionController } from "./sections/general-section/general-section.controller";
import { GeneralSectionModule } from "./sections/general-section/general-section.module";
import { InChargeSectionController } from "./sections/in-charge-section/in-charge-section.controller";
import { InChargeSectionModule } from "./sections/in-charge-section/in-charge-section.module";
import { SignaSectionController } from "./sections/signa-section/signa-section.controller";
import { SignaSectionModule } from "./sections/signa-section/signa-section.module";
import { SecuritySectionController } from "./sections/security-section/security-section.controller";
import { SecuritySectionModule } from "./sections/security-section/security-section.module";
import { SupplySectionController } from "./sections/supply-section/supply-section.controller";
import { InquirySectionController } from "./sections/inquiry-section/inquiry-section.controller";
import { InquirySectionModule } from "./sections/inquiry-section/inquiry-section.module";
import { SupplySectionModule } from "./sections/supply-section/supply-section.module";

@Module({
  controllers: [
    FestivalActivityController,
    GeneralSectionController,
    InChargeSectionController,
    InquirySectionController,
    SecuritySectionController,
    SignaSectionController,
    SupplySectionController,
  ],
  providers: [
    {
      provide: FestivalActivityService,
      useFactory: (
        adherents: PrismaAdherents,
        locations: PrismaLocations,
        inquiries: PrismaInquiries,
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
    InquirySectionModule,
    SecuritySectionModule,
    SignaSectionModule,
    SupplySectionModule,
  ],
})
export class FestivalActivityModule {}
