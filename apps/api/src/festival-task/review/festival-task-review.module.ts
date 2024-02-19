import { Module } from "@nestjs/common";
import { FestivalTaskReviewService } from "./festival-task-review.service";
import {
  AskForReviewTask,
  PrepareFestivalTask,
} from "@overbookd/festival-event";
import { DomainEventModule } from "../../domain-event/domain-event.module";
import { FestivalTaskCommonModule } from "../common/festival-task-common.module";
import { PrismaAdherents } from "../common/repository/adherent/adherents.prisma";
import { DomainEventService } from "../../domain-event/domain-event.service";

@Module({
  providers: [
    {
      provide: FestivalTaskReviewService,
      useFactory: (
        adherents: PrismaAdherents,
        prepare: PrepareFestivalTask,
        askForReview: AskForReviewTask,
        eventStore: DomainEventService,
      ) =>
        new FestivalTaskReviewService(
          adherents,
          prepare,
          askForReview,
          eventStore,
        ),
      inject: [
        PrismaAdherents,
        PrepareFestivalTask,
        AskForReviewTask,
        DomainEventService,
      ],
    },
  ],
  imports: [FestivalTaskCommonModule, DomainEventModule],
  exports: [FestivalTaskReviewService],
})
export class FestivalTaskReviewModule {}
