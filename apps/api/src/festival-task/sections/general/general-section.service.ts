import { Injectable } from "@nestjs/common";
import {
  FestivalTask,
  PrepareFestivalTask,
  UpdateGeneral,
} from "@overbookd/festival-event";

@Injectable()
export class GeneralSectionService {
  constructor(private readonly prepare: PrepareFestivalTask) {}

  save(id: FestivalTask["id"], general: UpdateGeneral): Promise<FestivalTask> {
    return this.prepare.updateGeneralSection(id, general);
  }
}
