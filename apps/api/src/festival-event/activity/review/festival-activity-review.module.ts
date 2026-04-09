import { Module } from "@nestjs/common";
import {
  AskForReview,
  PrepareFestivalActivity,
  Reviewing,
} from "@overbookd/festival-event";
import { DomainEventModule } from "../../../domain-event/domain-event.module";
import { DomainEventService } from "../../../domain-event/domain-event.service";
import { FestivalActivityCommonModule } from "../common/festival-activity-common.module";
import { PrismaAdherents } from "../common/repository/adherents.prisma";
import { FestivalActivityReviewService } from "./festival-activity-review.service";

@Module({
  providers: [
    {
      provide: FestivalActivityReviewService,
      useFactory: (
        adherents: PrismaAdherents,
        prepare: PrepareFestivalActivity,
        askForReview: AskForReview,
        reviewing: Reviewing,
        eventStore: DomainEventService,
      ) =>
        new FestivalActivityReviewService(
          adherents,
          prepare,
          askForReview,
          reviewing,
          eventStore,
        ),
      inject: [
        PrismaAdherents,
        PrepareFestivalActivity,
        AskForReview,
        Reviewing,
        DomainEventService,
      ],
    },
  ],
  imports: [FestivalActivityCommonModule, DomainEventModule],
  exports: [FestivalActivityReviewService],
})
export class FestivalActivityReviewModule {}
