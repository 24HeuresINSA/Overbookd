import { Module } from "@nestjs/common";
import { FestivalTaskCommonModule } from "../../common/festival-task-common.module";
import { InstructionsSectionService } from "./instructions-section.service";
import { PrepareFestivalTask } from "@overbookd/festival-event";

@Module({
  providers: [
    {
      provide: InstructionsSectionService,
      useFactory: (prepare: PrepareFestivalTask) =>
        new InstructionsSectionService(prepare),
      inject: [PrepareFestivalTask],
    },
  ],
  imports: [FestivalTaskCommonModule],
  exports: [InstructionsSectionService],
})
export class InstructionsSectionModule {}
