import { Injectable } from "@nestjs/common";
import {
  FestivalTask,
  InquiryRequest,
  PrepareFestivalTask,
} from "@overbookd/festival-event";
import { AddInquiryRequestForm } from "@overbookd/http";
import { Inquiries } from "../../common/festival-task-common.model";

@Injectable()
export class InquirySectionService {
  constructor(
    private readonly prepare: PrepareFestivalTask,
    private readonly inquiries: Inquiries,
  ) {}

  async addInquiryRequest(
    id: FestivalTask["id"],
    { slug, quantity }: AddInquiryRequestForm,
  ): Promise<FestivalTask> {
    const gear = await this.inquiries.find(slug);
    const inquiry = { ...gear, quantity };
    return this.prepare.addInquiry(id, inquiry);
  }

  removeInquiryRequest(
    id: FestivalTask["id"],
    slug: InquiryRequest["slug"],
  ): Promise<FestivalTask> {
    return this.prepare.removeInquiry(id, slug);
  }
}
