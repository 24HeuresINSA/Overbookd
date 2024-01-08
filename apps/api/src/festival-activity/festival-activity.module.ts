import { Module } from "@nestjs/common";

import { FestivalActivityCommonModule } from "./common/festival-activity-common.module";
import { StatisticsModule } from "../statistics/statistics.module";
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
import { FestivalActivityPreviewController } from "./preview/festival-activity-preview.controller";
import { FestivalActivityPreviewModule } from "./preview/festival-activity-preview.module";
import { FestivalActivityOverviewModule } from "./overview/festival-activity-overview.module";
import { FestivalActivityOverviewController } from "./overview/festival-activity-overview.controller";
import { FestivalActivityReviewController } from "./review/festival-activity-review.controller";
import { FestivalActivityReviewModule } from "./review/festival-activity-review.module";

@Module({
  controllers: [
    FestivalActivityPreviewController,
    FestivalActivityOverviewController,
    FestivalActivityReviewController,
    GeneralSectionController,
    InChargeSectionController,
    InquirySectionController,
    SecuritySectionController,
    SignaSectionController,
    SupplySectionController,
  ],
  imports: [
    StatisticsModule,
    FestivalActivityCommonModule,
    FestivalActivityPreviewModule,
    FestivalActivityOverviewModule,
    FestivalActivityReviewModule,
    GeneralSectionModule,
    InChargeSectionModule,
    InquirySectionModule,
    SecuritySectionModule,
    SignaSectionModule,
    SupplySectionModule,
  ],
})
export class FestivalActivityModule {}
