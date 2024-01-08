import { Module } from "@nestjs/common";
import { SecuritySectionService } from "./security-section.service";
import { PrepareFestivalActivity } from "@overbookd/festival-activity";
import { FestivalActivityCommonModule } from "../../common/festival-activity-common.module";

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
