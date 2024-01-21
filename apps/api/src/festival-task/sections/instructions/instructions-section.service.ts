import { Injectable } from "@nestjs/common";
import { PrepareFestivalTask } from "@overbookd/festival-event";

@Injectable()
export class InstructionsSectionService {
  constructor(private readonly prepare: PrepareFestivalTask) {}
}
