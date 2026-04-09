import { Module } from "@nestjs/common";
import { PrepareFestivalTask } from "@overbookd/festival-event";
import { FestivalTaskCommonModule } from "../../common/festival-task-common.module";
import { PrismaAdherents } from "../../common/repository/adherents.prisma";
import { MobilizationSectionService } from "./mobilization-section.service";

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
