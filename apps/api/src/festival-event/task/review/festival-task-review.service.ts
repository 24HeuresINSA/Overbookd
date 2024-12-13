import { Injectable } from "@nestjs/common";
import {
  AskForReviewTask,
  Categorize,
  EnableAssignment,
  FestivalTask,
  FestivalTaskReadyToAssign,
  FestivalTaskRefused,
  PrepareFestivalTask,
  ReviewTask,
} from "@overbookd/festival-event";
import { FestivalTask as FestivalTaskEvents } from "@overbookd/domain-events";
import {
  PublishFeedbackForm,
  ReviewApproval,
  ReviewIgnoreTask,
  ReviewRejection,
} from "@overbookd/http";
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
  enableAssignment: Readonly<EnableAssignment>;
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
    ftId: FestivalTask["id"],
    user: JwtUtil,
    rejection: ReviewRejection<"FT">,
  ): Promise<FestivalTaskRefused> {
    TeamService.checkMembership(user, rejection.team);

    const rejector = await this.repositories.adherents.findOne(user.id);
    const withRejector = { ...rejection, rejector };
    const task = await this.useCases.review.reject(ftId, withRejector);

    const event = FestivalTaskEvents.rejected(
      task,
      rejector.id,
      rejection.reason,
    );
    this.eventStore.publish(event);

    return task;
  }

  async approve(
    ftId: FestivalTask["id"],
    user: JwtUtil,
    approval: ReviewApproval<"FT">,
  ): Promise<FestivalTask> {
    TeamService.checkMembership(user, approval.team);

    const reviewer = await this.repositories.adherents.findOne(user.id);
    const withApprover = { ...approval, reviewer };
    const task = await this.useCases.review.approve(ftId, withApprover);

    const event = FestivalTaskEvents.approved(task, reviewer.id);
    this.eventStore.publish(event);

    return task;
  }

  async ignore(
    ftId: FestivalTask["id"],
    user: JwtUtil,
    { team }: ReviewIgnoreTask,
  ): Promise<FestivalTask> {
    TeamService.checkMembership(user, team);

    const reviewer = await this.repositories.adherents.findOne(user.id);
    const task = await this.useCases.review.ignore(ftId, team);

    const event = FestivalTaskEvents.ignored(task, reviewer.id);
    this.eventStore.publish(event);

    return task;
  }

  async enableAssignment(
    ftId: FestivalTask["id"],
    user: JwtUtil,
    categoryze: Categorize,
  ): Promise<FestivalTaskReadyToAssign> {
    const adherent = await this.repositories.adherents.findOne(user.id);
    return this.useCases.enableAssignment.for(ftId, adherent, categoryze);
  }
}
