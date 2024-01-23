import { Module } from "@nestjs/common";
import { FestivalTaskCommonModule } from "../../common/festival-task-common.module";
import { MobilizationSectionService } from "./mobilization-section.service";
import { PrepareFestivalTask } from "@overbookd/festival-event";
import { PrismaAdherents } from "../../common/repository/adherent/adherents.prisma";

@Module({
  providers: [
    {
      provide: MobilizationSectionService,
      useFactory: (prepare: PrepareFestivalTask, adherents: PrismaAdherents) =>
        new MobilizationSectionService(prepare, adherents),
      inject: [PrepareFestivalTask, PrismaAdherents],
    },
  ],
  imports: [FestivalTaskCommonModule],
  exports: [MobilizationSectionService],
})
export class MobilizationSectionModule {}
