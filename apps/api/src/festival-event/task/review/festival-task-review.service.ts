import { Injectable } from "@nestjs/common";
import {
  AskForReviewTask,
  FestivalTask,
  FestivalTaskRefused,
  PrepareFestivalTask,
  ReviewTask,
} from "@overbookd/festival-event";
import { FestivalTask as FestivalTaskEvents } from "@overbookd/domain-events";
import { PublishFeedbackForm, ReviewRejection } from "@overbookd/http";
import {
  JwtPayload,
  JwtUtil,
} from "../../../authentication/entities/jwt-util.entity";
import { Adherents } from "../common/festival-task-common.model";
import { DomainEventService } from "../../../domain-event/domain-event.service";
import { TeamService } from "../../../team/team.service";

type UseCases = {
  prepare: Readonly<PrepareFestivalTask>;
  askForReview: Readonly<AskForReviewTask>;
  review: Readonly<ReviewTask>;
};

type Repositories = {
  adherents: Adherents;
};

@Injectable()
export class FestivalTaskReviewService {
  constructor(
    private readonly useCases: UseCases,
    private readonly repositories: Repositories,
    private readonly eventStore: DomainEventService,
  ) {}

  async publishFeedback(
    ftId: FestivalTask["id"],
    { id }: JwtPayload,
    { content }: PublishFeedbackForm,
  ): Promise<FestivalTask> {
    const author = await this.repositories.adherents.findOne(id);

    return this.useCases.prepare.publishFeedback(ftId, { author, content });
  }

  async toReview(
    ftId: FestivalTask["id"],
    user: JwtPayload,
  ): Promise<FestivalTask> {
    const adherent = await this.repositories.adherents.findOne(user.id);
    const task = await this.useCases.askForReview.from(ftId, adherent);

    const event = FestivalTaskEvents.readyToReview(task, adherent.id);
    this.eventStore.publish(event);

    return task;
  }

  async reject(
    faId: number,
    user: JwtUtil,
    rejection: ReviewRejection<"FT">,
  ): Promise<FestivalTaskRefused> {
    TeamService.checkMembership(user, rejection.team);

    const rejector = await this.repositories.adherents.findOne(user.id);
    const withRejector = { ...rejection, rejector };
    const task = await this.useCases.review.reject(faId, withRejector);

    const event = FestivalTaskEvents.rejected(
      task,
      rejector.id,
      rejection.reason,
    );
    this.eventStore.publish(event);

    return task;
  }
}
