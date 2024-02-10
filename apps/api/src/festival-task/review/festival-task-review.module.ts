import { Module } from "@nestjs/common";
import { FestivalTaskReviewService } from "./festival-task-review.service";
import { PrepareFestivalTask } from "@overbookd/festival-event";
import { DomainEventModule } from "../../domain-event/domain-event.module";
import { FestivalTaskCommonModule } from "../common/festival-task-common.module";
import { PrismaAdherents } from "../common/repository/adherent/adherents.prisma";

@Module({
  providers: [
    {
      provide: FestivalTaskReviewService,
      useFactory: (adherents: PrismaAdherents, prepare: PrepareFestivalTask) =>
        new FestivalTaskReviewService(adherents, prepare),
      inject: [PrismaAdherents, PrepareFestivalTask],
    },
  ],
  imports: [FestivalTaskCommonModule, DomainEventModule],
  exports: [FestivalTaskReviewService],
})
export class FestivalTaskReviewModule {}
