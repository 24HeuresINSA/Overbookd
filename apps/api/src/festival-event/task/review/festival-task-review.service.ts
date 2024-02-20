import { Injectable } from "@nestjs/common";
import {
  AskForReviewTask,
  FestivalTask,
  PrepareFestivalTask,
} from "@overbookd/festival-event";
import { FestivalTask as FestivalTaskEvents } from "@overbookd/domain-events";
import { PublishFeedbackForm } from "@overbookd/http";
import { JwtPayload } from "../../../authentication/entities/jwt-util.entity";
import { Adherents } from "../common/festival-task-common.model";
import { DomainEventService } from "../../../domain-event/domain-event.service";

@Injectable()
export class FestivalTaskReviewService {
  constructor(
    private readonly adherents: Adherents,
    private readonly prepare: PrepareFestivalTask,
    private readonly askForReview: AskForReviewTask,
    private readonly eventStore: DomainEventService,
  ) {}

  async publishFeedback(
    ftId: FestivalTask["id"],
    { id }: JwtPayload,
    { content }: PublishFeedbackForm,
  ): Promise<FestivalTask> {
    const author = await this.adherents.findOne(id);

    return this.prepare.publishFeedback(ftId, { author, content });
  }

  async toReview(
    ftId: FestivalTask["id"],
    user: JwtPayload,
  ): Promise<FestivalTask> {
    const adherent = await this.adherents.findOne(user.id);
    const task = await this.askForReview.from(ftId, adherent);

    const event = FestivalTaskEvents.readyToReview(task, adherent.id);
    this.eventStore.publish(event);

    return task;
  }
}
