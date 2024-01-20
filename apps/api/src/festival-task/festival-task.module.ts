import { Module } from "@nestjs/common";
import { GeneralSectionModule } from "./sections/general/general-section.module";
import { GeneralSectionController } from "./sections/general/general-section.controller";
import { InstructionsSectionController } from "./sections/instructions/instructions-section.controller";
import { InstructionsSectionModule } from "./sections/instructions/instructions-section.module";
import { FestivalTaskCommonModule } from "./common/festival-task-common.module";
import { FestivalTaskOverviewModule } from "./overview/festival-activity-overview.module";
import { FestivalTaskOverviewController } from "./overview/festival-task-overview.controller";

@Module({
  controllers: [
    FestivalTaskOverviewController,
    GeneralSectionController,
    InstructionsSectionController,
  ],
  imports: [
    FestivalTaskCommonModule,
    FestivalTaskOverviewModule,
    GeneralSectionModule,
    InstructionsSectionModule,
  ],
})
export class FestivalTaskModule {}
