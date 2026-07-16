import { Injectable } from "@nestjs/common";
import { FestivalActivity as FestivalActivityEvents } from "@overbookd/domain-events";
import {
  AskForReview,
  FestivalActivity,
  PrepareFestivalActivity,
  Refused,
  Reviewable,
  Reviewer,
  Reviewing,
} from "@overbookd/festival-event";
import { ReviewRejection, PublishFeedbackForm } from "@overbookd/http";
import { DomainEventService } from "../../../domain-event/domain-event.service";
import { Adherents } from "../common/festival-activity-common.model";
import { RequestHydratedUser } from "../../../authentication-zitadel/request-hydrated-user";
import { checkMembership } from "../../../team/team.utils";

@Injectable()
export class FestivalActivityReviewService {
  constructor(
    private readonly adherents: Adherents,
    private readonly prepare: PrepareFestivalActivity,
    private readonly askForReview: AskForReview,
    private readonly reviewing: Reviewing,
    private readonly eventStore: DomainEventService,
  ) {}

  async addFeedback(
    faId: FestivalActivity["id"],
    { id }: RequestHydratedUser,
    { content }: PublishFeedbackForm,
  ): Promise<FestivalActivity> {
    const author = await this.adherents.find(id);

    return this.prepare.publishFeedback(faId, { author, content });
  }

  async toReview(
    faId: FestivalActivity["id"],
    user: RequestHydratedUser,
  ): Promise<FestivalActivity> {
    const adherent = await this.adherents.find(user.id);
    const activity = await this.askForReview.from(faId, adherent);

    const event = FestivalActivityEvents.readyToReview(activity, adherent.id);
    this.eventStore.publish(event);

    return activity;
  }

  async approve(
    faId: FestivalActivity["id"],
    user: RequestHydratedUser,
    team: Reviewer<"FA">,
  ): Promise<Reviewable> {
    checkMembership(user, team);

    const approver = await this.adherents.find(user.id);
    const activity = await this.reviewing.approve(faId, team, approver);

    const event = FestivalActivityEvents.approved(activity, approver.id);
    this.eventStore.publish(event);

    return activity;
  }

  async reject(
    faId: number,
    user: RequestHydratedUser,
    rejection: ReviewRejection<"FA">,
  ): Promise<Refused> {
    checkMembership(user, rejection.team);

    const rejector = await this.adherents.find(user.id);
    const withRejector = { ...rejection, rejector };
    const activity = await this.reviewing.reject(faId, withRejector);

    const event = FestivalActivityEvents.rejected(
      activity,
      rejector.id,
      rejection.reason,
    );
    this.eventStore.publish(event);

    return activity;
  }
}
