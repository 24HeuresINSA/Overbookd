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
import { JwtPayload } from "../../authentication/entities/jwt-util.entity";
import { FestivalTaskCreationForm } from "@overbookd/http";

@Injectable()
export class FestivalTaskOverviewService {
  constructor(
    private readonly adherents: Adherents,
    private readonly festivalActivities: FestivalActivities,
    private readonly create: CreateFestivalTask,
    private readonly view: ViewFestivalTask,
    private readonly remove: RemoveFestivalTasks,
  ) {}

  findById(id: FestivalTask["id"]): Promise<FestivalTask | null> {
    return this.view.one(id);
  }

  async createOne(
    { id }: JwtPayload,
    { name, festivalActivityId }: FestivalTaskCreationForm,
  ): Promise<FestivalTaskDraft> {
    const author = await this.adherents.find(id);
    const festivalActivity =
      await this.festivalActivities.find(festivalActivityId);

    return this.create.apply({
      author,
      name,
      festivalActivity,
    });
  }

  async removeOn(id: FestivalTask["id"]): Promise<void> {
    await this.remove.apply(id);
  }
}
