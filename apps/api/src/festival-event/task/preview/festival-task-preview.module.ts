import { Module } from "@nestjs/common";
import { FestivalTaskPreviewService } from "./festival-task-preview.service";
import { ViewFestivalTask } from "@overbookd/festival-event";
import { FestivalTaskCommonModule } from "../common/festival-task-common.module";

@Module({
  providers: [
    {
      provide: FestivalTaskPreviewService,
      useFactory: (view: ViewFestivalTask) =>
        new FestivalTaskPreviewService(view),
      inject: [ViewFestivalTask],
    },
  ],
  imports: [FestivalTaskCommonModule],
  exports: [FestivalTaskPreviewService],
})
export class FestivalTaskPreviewModule {}
