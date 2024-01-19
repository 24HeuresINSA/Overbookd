import { Module } from "@nestjs/common";
import { FestivalTaskCommonModule } from "../../common/festival-task-common.module";
import { InstructionsSectionService } from "./instructions-section.service";

@Module({
  providers: [InstructionsSectionService],
  imports: [FestivalTaskCommonModule],
  exports: [InstructionsSectionService],
})
export class InstructionsSectionModule {}
