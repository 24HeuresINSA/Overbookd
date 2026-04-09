import { Module } from "@nestjs/common";
import { StatisticsModule } from "../statistics/statistics.module";
import { FestivalTaskCommonModule } from "./common/festival-task-common.module";
import { FestivalTaskOverviewController } from "./overview/festival-task-overview.controller";
import { FestivalTaskOverviewModule } from "./overview/festival-task-overview.module";
import { FestivalTaskPreviewController } from "./preview/festival-task-preview.controller";
import { FestivalTaskPreviewModule } from "./preview/festival-task-preview.module";
import { FestivalTaskReviewController } from "./review/festival-task-review.controller";
import { FestivalTaskReviewModule } from "./review/festival-task-review.module";
import { GeneralSectionController } from "./sections/general/general-section.controller";
import { GeneralSectionModule } from "./sections/general/general-section.module";
import { InquirySectionController } from "./sections/inquiry/inquiry-section.controller";
import { InquirySectionModule } from "./sections/inquiry/inquiry-section.module";
import { InstructionsSectionController } from "./sections/instructions/instructions-section.controller";
import { InstructionsSectionModule } from "./sections/instructions/instructions-section.module";
import { MobilizationSectionController } from "./sections/mobilization/mobilization-section.controller";
import { MobilizationSectionModule } from "./sections/mobilization/mobilization-section.module";

@Module({
  controllers: [
    FestivalTaskPreviewController,
    FestivalTaskOverviewController,
    FestivalTaskReviewController,
    GeneralSectionController,
    InstructionsSectionController,
    MobilizationSectionController,
    InquirySectionController,
  ],
  imports: [
    FestivalTaskCommonModule,
    FestivalTaskPreviewModule,
    FestivalTaskOverviewModule,
    FestivalTaskReviewModule,
    GeneralSectionModule,
    InstructionsSectionModule,
    MobilizationSectionModule,
    InquirySectionModule,
    StatisticsModule,
  ],
})
export class FestivalTaskModule {}
