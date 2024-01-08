import { Module } from "@nestjs/common";
import { GeneralSectionService } from "./general-section.service";
import { PrepareFestivalActivity } from "@overbookd/festival-activity";
import { FestivalActivityCommonModule } from "../common/festival-activity-common.module";

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
