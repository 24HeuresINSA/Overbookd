import { Injectable } from "@nestjs/common";
import { FestivalTask, PrepareFestivalTask } from "@overbookd/festival-event";
import { UpdateInstructionsForm } from "@overbookd/http";
import { Locations } from "../../common/festival-task-common.model";

@Injectable()
export class InstructionsSectionService {
  constructor(
    private readonly prepare: PrepareFestivalTask,
    private readonly locations: Locations,
  ) {}

  async update(
    id: FestivalTask["id"],
    instructions: UpdateInstructionsForm,
  ): Promise<FestivalTask> {
    const appointment = instructions.appointmentId
      ? { appointment: await this.locations.find(instructions.appointmentId) }
      : {};

    return this.prepare.updateInstructionsSection(id, {
      ...instructions,
      ...appointment,
    });
  }
}
