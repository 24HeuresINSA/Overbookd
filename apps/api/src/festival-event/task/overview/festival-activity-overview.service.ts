import { Injectable } from "@nestjs/common";
import {
  Adherents,
  FestivalActivities,
  RemoveFestivalTasks,
} from "../common/festival-task-common.model";
import {
  CreateFestivalTask,
  FestivalTask,
  FestivalTaskDraft,
  ViewFestivalTask,
} from "@overbookd/festival-event";
import { FestivalTask as FestivalTaskEvents } from "@overbookd/domain-events";
import { JwtPayload } from "../../../authentication/entities/jwt-util.entity";
import { FestivalTaskCreationForm } from "@overbookd/http";
import { DomainEventService } from "../../../domain-event/domain-event.service";

type UseCases = {
  create: Readonly<CreateFestivalTask>;
  view: Readonly<ViewFestivalTask>;
  remove: Readonly<RemoveFestivalTasks>;
};

type Repositories = {
  adherents: Adherents;
  festivalActivities: FestivalActivities;
};

@Injectable()
export class FestivalTaskOverviewService {
  constructor(
    private readonly useCases: UseCases,
    private readonly repositories: Repositories,
    private readonly eventStore: DomainEventService,
  ) {}

  findById(id: FestivalTask["id"]): Promise<FestivalTask | null> {
    return this.useCases.view.one(id);
  }

  async createOne(
    { id }: JwtPayload,
    { name, festivalActivityId }: FestivalTaskCreationForm,
  ): Promise<FestivalTaskDraft> {
    const author = await this.repositories.adherents.findOne(id);
    const festivalActivity =
      await this.repositories.festivalActivities.find(festivalActivityId);

    const task = await this.useCases.create.apply({
      author,
      name,
      festivalActivity,
    });

    const event = FestivalTaskEvents.created(task, author.id);
    this.eventStore.publish(event);

    return task;
  }

  async removeOne(id: FestivalTask["id"]): Promise<void> {
    await this.useCases.remove.apply(id);
  }
}
