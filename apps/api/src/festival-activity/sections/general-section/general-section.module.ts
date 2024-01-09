import { Module } from "@nestjs/common";
import { PrepareFestivalActivity } from "@overbookd/festival-event";
import { FestivalActivityCommonModule } from "../../common/festival-activity-common.module";
import { GeneralSectionService } from "./general-section.service";

@Module({
  providers: [
    {
      provide: GeneralSectionService,
      useFactory: (prepare: PrepareFestivalActivity) =>
        new GeneralSectionService(prepare),
      inject: [PrepareFestivalActivity],
    },
  ],
  imports: [FestivalActivityCommonModule],
  exports: [GeneralSectionService],
})
export class GeneralSectionModule {}
