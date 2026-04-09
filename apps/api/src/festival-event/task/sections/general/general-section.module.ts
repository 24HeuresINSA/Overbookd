import { Module } from "@nestjs/common";
import { PrepareFestivalTask } from "@overbookd/festival-event";
import { FestivalTaskCommonModule } from "../../common/festival-task-common.module";
import { PrismaAdherents } from "../../common/repository/adherents.prisma";
import { GeneralSectionService } from "./general-section.service";

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
