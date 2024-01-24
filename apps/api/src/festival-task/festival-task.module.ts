import { Module } from "@nestjs/common";
import { GeneralSectionModule } from "./sections/general/general-section.module";
import { GeneralSectionController } from "./sections/general/general-section.controller";
import { InstructionsSectionController } from "./sections/instructions/instructions-section.controller";
import { InstructionsSectionModule } from "./sections/instructions/instructions-section.module";
import { FestivalTaskCommonModule } from "./common/festival-task-common.module";
import { FestivalTaskOverviewModule } from "./overview/festival-activity-overview.module";
import { FestivalTaskOverviewController } from "./overview/festival-task-overview.controller";
import { FestivalTaskPreviewModule } from "./preview/festival-task-preview.module";
import { FestivalTaskPreviewController } from "./preview/festival-task-preview.controller";
import { MobilizationSectionModule } from "./sections/mobilization/mobilization-section.module";
import { MobilizationSectionController } from "./sections/mobilization/mobilization-section.controller";
import { InquirySectionModule } from "./sections/inquiry/inquiry-section.module";
import { InquirySectionController } from "./sections/inquiry/inquiry-section.controller";

@Module({
  controllers: [
    FestivalTaskOverviewController,
    FestivalTaskPreviewController,
    GeneralSectionController,
    InstructionsSectionController,
    MobilizationSectionController,
    InquirySectionController,
  ],
  imports: [
    FestivalTaskCommonModule,
    FestivalTaskOverviewModule,
    FestivalTaskPreviewModule,
    GeneralSectionModule,
    InstructionsSectionModule,
    MobilizationSectionModule,
    InquirySectionModule,
  ],
})
export class FestivalTaskModule {}
