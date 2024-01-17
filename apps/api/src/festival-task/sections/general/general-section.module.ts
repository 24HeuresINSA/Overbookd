import { Module } from "@nestjs/common";
import { GeneralSectionService } from "./general-section.service";
import { FestivalTaskCommonModule } from "../../common/festival-task-common.module";

@Module({
  providers: [GeneralSectionService],
  imports: [FestivalTaskCommonModule],
  exports: [GeneralSectionService],
})
export class GeneralSectionModule {}
