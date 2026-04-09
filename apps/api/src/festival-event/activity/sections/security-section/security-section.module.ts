import { Module } from "@nestjs/common";
import { PrepareFestivalActivity } from "@overbookd/festival-event";
import { FestivalActivityCommonModule } from "../../common/festival-activity-common.module";
import { SecuritySectionService } from "./security-section.service";

@Module({
  providers: [
    {
      provide: SecuritySectionService,
      useFactory: (prepare: PrepareFestivalActivity) =>
        new SecuritySectionService(prepare),
      inject: [PrepareFestivalActivity],
    },
  ],
  imports: [FestivalActivityCommonModule],
  exports: [SecuritySectionService],
})
export class SecuritySectionModule {}
