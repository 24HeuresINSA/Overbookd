import { Module } from "@nestjs/common";
import { FestivalTaskCommonModule } from "../../common/festival-task-common.module";
import { InstructionsSectionService } from "./instructions-section.service";
import { PrepareFestivalTask } from "@overbookd/festival-event";
import { PrismaLocations } from "../../common/repository/location/locations.prisma";

@Module({
  providers: [
    {
      provide: InstructionsSectionService,
      useFactory: (prepare: PrepareFestivalTask, locations: PrismaLocations) =>
        new InstructionsSectionService(prepare, locations),
      inject: [PrepareFestivalTask, PrismaLocations],
    },
  ],
  imports: [FestivalTaskCommonModule],
  exports: [InstructionsSectionService],
})
export class InstructionsSectionModule {}
