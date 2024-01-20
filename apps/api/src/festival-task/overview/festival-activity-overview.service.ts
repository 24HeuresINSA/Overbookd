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
  PrepareFestivalTask,
} from "@overbookd/festival-event";
import { JwtPayload } from "../../authentication/entities/jwt-util.entity";
import { FestivalTaskCreationForm } from "@overbookd/http";

@Injectable()
export class FestivalTaskOverviewService {
  constructor(
    private readonly adherents: Adherents,
    private readonly festivalActivities: FestivalActivities,
    private readonly creation: CreateFestivalTask,
    private readonly preparation: PrepareFestivalTask,
    private readonly removal: RemoveFestivalTasks,
  ) {}

  findById(id: FestivalTask["id"]): Promise<FestivalTask | null> {
    return this.preparation.findById(id);
  }

  async create(
    { id }: JwtPayload,
    { name, festivalActivityId }: FestivalTaskCreationForm,
  ): Promise<FestivalTaskDraft> {
    const author = await this.adherents.find(id);
    const festivalActivity =
      await this.festivalActivities.find(festivalActivityId);

    const activity = await this.creation.apply({
      author,
      name,
      festivalActivity,
    });

    return activity;
  }

  async remove(id: FestivalTask["id"]): Promise<void> {
    await this.removal.remove(id);
  }
}
