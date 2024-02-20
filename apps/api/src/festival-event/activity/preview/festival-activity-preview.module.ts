import { Module } from "@nestjs/common";
import { FestivalActivityPreviewService } from "./festival-activity-preview.service";
import { PrepareFestivalActivity } from "@overbookd/festival-event";
import { PrismaPreviews } from "../common/repository/previews.prisma";
import { FestivalActivityCommonModule } from "../common/festival-activity-common.module";

@Module({
  providers: [
    {
      provide: FestivalActivityPreviewService,
      useFactory: (
        prepare: PrepareFestivalActivity,
        previews: PrismaPreviews,
      ) => new FestivalActivityPreviewService(prepare, previews),
      inject: [PrepareFestivalActivity, PrismaPreviews],
    },
  ],
  imports: [FestivalActivityCommonModule],
  exports: [FestivalActivityPreviewService],
})
export class FestivalActivityPreviewModule {}
