import { Module } from "@nestjs/common";
import { PrepareFestivalActivity } from "@overbookd/festival-event";
import { FestivalActivityCommonModule } from "../common/festival-activity-common.module";
import { PrismaPreviews } from "../common/repository/previews.prisma";
import { FestivalActivityPreviewService } from "./festival-activity-preview.service";

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
