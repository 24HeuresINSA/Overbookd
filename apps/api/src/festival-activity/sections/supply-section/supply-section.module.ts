import { Module } from "@nestjs/common";
import { SupplySectionService } from "./supply-section.service";
import { PrepareFestivalActivity } from "@overbookd/festival-activity";
import { FestivalActivityCommonModule } from "../../common/festival-activity-common.module";

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
