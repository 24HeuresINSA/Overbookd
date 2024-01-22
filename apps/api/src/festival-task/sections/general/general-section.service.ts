import { Injectable } from "@nestjs/common";
import { FestivalTask, PrepareFestivalTask } from "@overbookd/festival-event";
import { Adherents } from "../../common/festival-task-common.model";
import { UpdateGeneralForm } from "@overbookd/http";

@Injectable()
export class GeneralSectionService {
  constructor(
    private readonly prepare: PrepareFestivalTask,
    private readonly adherents: Adherents,
  ) {}

  async update(
    id: FestivalTask["id"],
    general: UpdateGeneralForm,
  ): Promise<FestivalTask> {
    const administrator = general.administratorId
      ? { administrator: await this.adherents.find(general.administratorId) }
      : {};

    return this.prepare.updateGeneralSection(id, {
      ...general,
      ...administrator,
    });
  }
}
