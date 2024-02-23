import { Module } from "@nestjs/common";
import { FestivalTaskReviewService } from "./festival-task-review.service";
import {
  AskForReviewTask,
  PrepareFestivalTask,
  ReviewTask,
} from "@overbookd/festival-event";
import { DomainEventModule } from "../../../domain-event/domain-event.module";
import { FestivalTaskCommonModule } from "../common/festival-task-common.module";
import { PrismaAdherents } from "../common/repository/adherents.prisma";
import { DomainEventService } from "../../../domain-event/domain-event.service";

@Module({
  providers: [
    {
      provide: FestivalTaskReviewService,
      useFactory: (
        prepare: PrepareFestivalTask,
        askForReview: AskForReviewTask,
        review: ReviewTask,
        adherents: PrismaAdherents,
        eventStore: DomainEventService,
      ) =>
        new FestivalTaskReviewService(
          { prepare, askForReview, review },
          { adherents },
          eventStore,
        ),
      inject: [
        PrepareFestivalTask,
        AskForReviewTask,
        ReviewTask,
        PrismaAdherents,
        DomainEventService,
      ],
    },
  ],
  imports: [FestivalTaskCommonModule, DomainEventModule],
  exports: [FestivalTaskReviewService],
})
export class FestivalTaskReviewModule {}
