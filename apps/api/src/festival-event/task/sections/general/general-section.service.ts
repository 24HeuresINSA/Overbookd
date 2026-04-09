import { Injectable } from "@nestjs/common";
import { FestivalTask, PrepareFestivalTask } from "@overbookd/festival-event";
import { UpdateGeneralForm } from "@overbookd/http";
import { Adherents } from "../../common/festival-task-common.model";

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
      ? { administrator: await this.adherents.findOne(general.administratorId) }
      : {};

    return this.prepare.updateGeneralSection(id, {
      ...general,
      ...administrator,
    });
  }
}
