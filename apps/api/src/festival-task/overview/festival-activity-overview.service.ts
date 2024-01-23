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
import { JwtPayload } from "../../authentication/entities/jwt-util.entity";
import { FestivalTaskCreationForm } from "@overbookd/http";
import { DomainEventService } from "../../domain-event/domain-event.service";

@Injectable()
export class FestivalTaskOverviewService {
  constructor(
    private readonly adherents: Adherents,
    private readonly festivalActivities: FestivalActivities,
    private readonly create: CreateFestivalTask,
    private readonly view: ViewFestivalTask,
    private readonly remove: RemoveFestivalTasks,
    private readonly eventStore: DomainEventService,
  ) {}

  findById(id: FestivalTask["id"]): Promise<FestivalTask | null> {
    return this.view.one(id);
  }

  async createOne(
    { id }: JwtPayload,
    { name, festivalActivityId }: FestivalTaskCreationForm,
  ): Promise<FestivalTaskDraft> {
    const author = await this.adherents.findOne(id);
    const festivalActivity =
      await this.festivalActivities.find(festivalActivityId);

    const task = await this.create.apply({
      author,
      name,
      festivalActivity,
    });

    const event = FestivalTaskEvents.created(task, author.id);
    this.eventStore.publish(event);

    return task;
  }

  async removeOn(id: FestivalTask["id"]): Promise<void> {
    await this.remove.apply(id);
  }
}
