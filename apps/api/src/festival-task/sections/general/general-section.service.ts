import { Injectable } from "@nestjs/common";
import { PrepareFestivalTask } from "@overbookd/festival-event";

@Injectable()
export class GeneralSectionService {
  constructor(private readonly prepare: PrepareFestivalTask) {}
}
