import { Injectable } from "@nestjs/common";
import {
  PreviewFestivalTask,
  ViewFestivalTask,
} from "@overbookd/festival-event";

@Injectable()
export class FestivalTaskPreviewService {
  constructor(private readonly view: ViewFestivalTask) {}

  findForAll(): Promise<PreviewFestivalTask[]> {
    return this.view.all();
  }
}
