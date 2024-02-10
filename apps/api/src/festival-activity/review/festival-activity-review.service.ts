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
import { ReviewRejection, PrepareFeedbackPublish } from "@overbookd/http";
import {
  JwtPayload,
  JwtUtil,
} from "../../authentication/entities/jwt-util.entity";
import { DomainEventService } from "../../domain-event/domain-event.service";
import { TeamService } from "../../team/team.service";
import { Adherents } from "../common/festival-activity-common.model";

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
    { id }: JwtPayload,
    { content }: PrepareFeedbackPublish,
  ): Promise<FestivalActivity> {
    const author = await this.adherents.find(id);

    return this.prepare.publishFeedback(faId, { author, content });
  }

  async toReview(
    faId: FestivalActivity["id"],
    user: JwtPayload,
  ): Promise<FestivalActivity> {
    const adherent = await this.adherents.find(user.id);
    const activity = await this.askForReview.from(faId, adherent);

    const event = FestivalActivityEvents.readyToReview(activity, adherent.id);
    this.eventStore.publish(event);

    return activity;
  }

  async approve(
    faId: FestivalActivity["id"],
    user: JwtUtil,
    team: Reviewer<"FA">,
  ): Promise<Reviewable> {
    TeamService.checkMembership(user, team);

    const approver = await this.adherents.find(user.id);
    const activity = await this.reviewing.approve(faId, team, approver);

    const event = FestivalActivityEvents.approved(activity, approver.id);
    this.eventStore.publish(event);

    return activity;
  }

  async reject(
    faId: number,
    user: JwtUtil,
    rejection: ReviewRejection,
  ): Promise<Refused> {
    TeamService.checkMembership(user, rejection.team);

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
