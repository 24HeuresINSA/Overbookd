import { Module } from "@nestjs/common";
import { PrepareFestivalActivity } from "@overbookd/festival-event";
import { FestivalActivityCommonModule } from "../../common/festival-activity-common.module";
import { SupplySectionService } from "./supply-section.service";

@Module({
  providers: [
    {
      provide: SupplySectionService,
      useFactory: (prepare: PrepareFestivalActivity) =>
        new SupplySectionService(prepare),
      inject: [PrepareFestivalActivity],
    },
  ],
  imports: [FestivalActivityCommonModule],
  exports: [SupplySectionService],
})
export class SupplySectionModule {}
