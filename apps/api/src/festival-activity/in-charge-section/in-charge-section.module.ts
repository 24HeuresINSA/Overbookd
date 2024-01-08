import { Module } from "@nestjs/common";
import { InChargeSectionService } from "./in-charge-section.service";
import { PrismaAdherents } from "../common/repository/adherents.prisma";
import { PrepareFestivalActivity } from "@overbookd/festival-activity";
import { FestivalActivityCommonModule } from "../common/festival-activity-common.module";

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
