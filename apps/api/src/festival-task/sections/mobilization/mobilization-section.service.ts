import { Injectable } from "@nestjs/common";
import {
  FestivalTask,
  Mobilization,
  PrepareFestivalTask,
} from "@overbookd/festival-event";
import { Adherents } from "../../common/festival-task-common.model";
import { AddMobilizationForm } from "@overbookd/http";

@Injectable()
export class MobilizationSectionService {
  constructor(
    private readonly prepare: PrepareFestivalTask,
    private readonly adherents: Adherents,
  ) {}

  async add(
    id: FestivalTask["id"],
    form: AddMobilizationForm,
  ): Promise<FestivalTask> {
    const volunteers = await this.adherents.findMany(form.volunteers);
    const mobilization = { ...form, volunteers };

    return this.prepare.addMobilization(id, mobilization);
  }

  async remove(
    id: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
  ): Promise<FestivalTask> {
    return this.prepare.removeMobilization(id, mobilizationId);
  }
}
