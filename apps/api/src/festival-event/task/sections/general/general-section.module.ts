import { Module } from "@nestjs/common";
import { GeneralSectionService } from "./general-section.service";
import { FestivalTaskCommonModule } from "../../common/festival-task-common.module";
import { PrepareFestivalTask } from "@overbookd/festival-event";
import { PrismaAdherents } from "../../common/repository/adherents.prisma";

@Module({
  providers: [
    {
      provide: GeneralSectionService,
      useFactory: (prepare: PrepareFestivalTask, adherents: PrismaAdherents) =>
        new GeneralSectionService(prepare, adherents),
      inject: [PrepareFestivalTask, PrismaAdherents],
    },
  ],
  imports: [FestivalTaskCommonModule],
  exports: [GeneralSectionService],
})
export class GeneralSectionModule {}
