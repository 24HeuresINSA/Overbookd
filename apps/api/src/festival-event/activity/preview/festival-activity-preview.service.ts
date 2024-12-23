import { Injectable } from "@nestjs/common";
import {
  PrepareFestivalActivity,
  PreviewFestivalActivity as PreviewForAll,
} from "@overbookd/festival-event";
import {
  PreviewForSecurity,
  PreviewForCommunication,
  PreviewForLogistic,
} from "@overbookd/http";
import { Previews } from "../common/festival-activity-common.model";

@Injectable()
export class FestivalActivityPreviewService {
  constructor(
    private readonly prepare: PrepareFestivalActivity,
    private readonly previews: Previews,
  ) {}

  findForAll(): Promise<PreviewForAll[]> {
    return this.prepare.findAll();
  }

  findMine(userId: number): Promise<PreviewForAll[]> {
    return this.prepare.findByAdherentId(userId);
  }

  findForSecurity(): Promise<PreviewForSecurity[]> {
    return this.previews.forSecurity();
  }

  findForCommunication(): Promise<PreviewForCommunication[]> {
    return this.previews.forCommunication();
  }

  findForLogistic(): Promise<PreviewForLogistic[]> {
    return this.previews.forLogistic();
  }
}
