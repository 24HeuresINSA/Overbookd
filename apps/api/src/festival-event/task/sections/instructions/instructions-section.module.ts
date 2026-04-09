import { Module } from "@nestjs/common";
import { PrepareFestivalTask } from "@overbookd/festival-event";
import { PrismaLocations } from "../../../common/repository/locations.prisma";
import { FestivalTaskCommonModule } from "../../common/festival-task-common.module";
import { PrismaAdherents } from "../../common/repository/adherents.prisma";
import { InstructionsSectionService } from "./instructions-section.service";

@Module({
  providers: [
    {
      provide: InstructionsSectionService,
      useFactory: (
        prepare: PrepareFestivalTask,
        locations: PrismaLocations,
        adherents: PrismaAdherents,
      ) => new InstructionsSectionService(prepare, locations, adherents),
      inject: [PrepareFestivalTask, PrismaLocations, PrismaAdherents],
    },
  ],
  imports: [FestivalTaskCommonModule],
  exports: [InstructionsSectionService],
})
export class InstructionsSectionModule {}
