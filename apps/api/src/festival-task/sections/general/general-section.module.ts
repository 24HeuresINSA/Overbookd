import { Module } from "@nestjs/common";
import { GeneralSectionService } from "./general-section.service";
import { FestivalTaskCommonModule } from "../../common/festival-task-common.module";
import { PrepareFestivalTask } from "@overbookd/festival-event";

@Module({
  providers: [
    {
      provide: GeneralSectionService,
      useFactory: (prepare: PrepareFestivalTask) =>
        new GeneralSectionService(prepare),
      inject: [PrepareFestivalTask],
    },
  ],
  imports: [FestivalTaskCommonModule],
  exports: [GeneralSectionService],
})
export class GeneralSectionModule {}
