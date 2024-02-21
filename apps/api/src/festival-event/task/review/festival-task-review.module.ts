import { Module } from "@nestjs/common";
import { FestivalTaskReviewService } from "./festival-task-review.service";
import {
  AskForReviewTask,
  PrepareFestivalTask,
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
        adherents: PrismaAdherents,
        eventStore: DomainEventService,
      ) =>
        new FestivalTaskReviewService(
          { prepare, askForReview },
          { adherents },
          eventStore,
        ),
      inject: [
        PrepareFestivalTask,
        AskForReviewTask,
        PrismaAdherents,
        DomainEventService,
      ],
    },
  ],
  imports: [FestivalTaskCommonModule, DomainEventModule],
  exports: [FestivalTaskReviewService],
})
export class FestivalTaskReviewModule {}
