import { Module } from "@nestjs/common";
import { FestivalTaskCommonModule } from "../../common/festival-task-common.module";
import { InstructionsSectionService } from "./instructions-section.service";
import { PrepareFestivalTask } from "@overbookd/festival-event";
import { PrismaLocations } from "../../common/repository/location/locations.prisma";
import { PrismaAdherents } from "../../common/repository/adherent/adherents.prisma";

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
