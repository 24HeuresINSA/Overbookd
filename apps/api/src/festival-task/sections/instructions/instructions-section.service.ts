import { Injectable } from "@nestjs/common";
import {
  FestivalTask,
  PrepareFestivalTask,
  UpdateInstructions,
} from "@overbookd/festival-event";

@Injectable()
export class InstructionsSectionService {
  constructor(private readonly prepare: PrepareFestivalTask) {}

  save(
    id: FestivalTask["id"],
    instructions: UpdateInstructions,
  ): Promise<FestivalTask> {
    return this.prepare.updateInstructionsSection(id, instructions);
  }
}
