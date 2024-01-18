import { Module } from "@nestjs/common";
import { GeneralSectionModule } from "./sections/general/general-section.module";
import { GeneralSectionController } from "./sections/general/general-section.controller";
import { InstructionsSectionController } from "./sections/instructions/instructions-section.controller";
import { InstructionsSectionModule } from "./sections/instructions/instructions-section.module";

@Module({
  controllers: [GeneralSectionController, InstructionsSectionController],
  imports: [GeneralSectionModule, InstructionsSectionModule],
})
export class FestivalTaskModule {}
