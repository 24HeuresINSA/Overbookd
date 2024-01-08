import { Module } from "@nestjs/common";
import { GeneralSectionController } from "./general-section.controller";
import { GeneralSectionService } from "./general-section.service";
import { PrepareFestivalActivity } from "@overbookd/festival-activity";
import { FestivalActivityCommonModule } from "../common/festival-activity-common.module";

@Module({
  controllers: [GeneralSectionController],
  providers: [
    {
      provide: GeneralSectionService,
      useFactory: (prepare: PrepareFestivalActivity) =>
        new GeneralSectionService(prepare),
      inject: [PrepareFestivalActivity],
    },
  ],
  imports: [FestivalActivityCommonModule],
})
export class GeneralSectionModule {}
