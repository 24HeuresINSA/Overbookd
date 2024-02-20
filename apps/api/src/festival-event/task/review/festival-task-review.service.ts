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

type UseCases = {
  prepare: Readonly<PrepareFestivalTask>;
  askForReview: Readonly<AskForReviewTask>;
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
}
