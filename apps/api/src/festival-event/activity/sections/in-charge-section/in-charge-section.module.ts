import { Module } from "@nestjs/common";
import { PrepareFestivalActivity } from "@overbookd/festival-event";
import { FestivalActivityCommonModule } from "../../common/festival-activity-common.module";
import { PrismaAdherents } from "../../common/repository/adherents.prisma";
import { InChargeSectionService } from "./in-charge-section.service";

@Module({
  providers: [
    {
      provide: InChargeSectionService,
      useFactory: (
        adherents: PrismaAdherents,
        prepare: PrepareFestivalActivity,
      ) => new InChargeSectionService(adherents, prepare),
      inject: [PrismaAdherents, PrepareFestivalActivity],
    },
  ],
  imports: [FestivalActivityCommonModule],
  exports: [InChargeSectionService],
})
export class InChargeSectionModule {}
