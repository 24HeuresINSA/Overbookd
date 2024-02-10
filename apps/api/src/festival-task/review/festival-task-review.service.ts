import { Injectable } from "@nestjs/common";
import { FestivalTask, PrepareFestivalTask } from "@overbookd/festival-event";
import { PrepareFeedbackPublish } from "@overbookd/http";
import { JwtPayload } from "../../authentication/entities/jwt-util.entity";
import { Adherents } from "../common/festival-task-common.model";

@Injectable()
export class FestivalTaskReviewService {
  constructor(
    private readonly adherents: Adherents,
    private readonly prepare: PrepareFestivalTask,
  ) {}

  async addFeedback(
    ftId: FestivalTask["id"],
    { id }: JwtPayload,
    { content }: PrepareFeedbackPublish,
  ): Promise<FestivalTask> {
    const author = await this.adherents.findOne(id);

    return this.prepare.publishFeedback(ftId, { author, content });
  }
}
