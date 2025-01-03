import { Injectable, NotFoundException } from "@nestjs/common";
import {
  AssignDrive,
  FestivalTask,
  InquiryRequest,
  PrepareFestivalTask,
} from "@overbookd/festival-event";
import {
  AddInquiryRequestForm,
  UpdateInquiryRequestForm,
} from "@overbookd/http";
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
    if (!gear) throw new NotFoundException("Le matos recherché n'existe pas");

    const inquiry = { ...gear, quantity };
    return this.prepare.addInquiry(id, inquiry);
  }

  async updateInquiryRequest(
    id: FestivalTask["id"],
    slug: InquiryRequest["slug"],
    { quantity }: UpdateInquiryRequestForm,
  ): Promise<FestivalTask> {
    const gear = await this.inquiries.find(slug);
    if (!gear) throw new NotFoundException("Le matos recherché n'existe pas");

    const request = { ...gear, quantity };
    return this.prepare.updateInquiry(id, request);
  }

  removeInquiryRequest(
    id: FestivalTask["id"],
    slug: InquiryRequest["slug"],
  ): Promise<FestivalTask> {
    return this.prepare.removeInquiry(id, slug);
  }

  async linkInquiryRequestToDrive(
    id: FestivalTask["id"],
    link: AssignDrive,
  ): Promise<FestivalTask> {
    const gear = await this.inquiries.find(link.slug);
    if (!gear) throw new NotFoundException("Le matos recherché n'existe pas");

    return this.prepare.assignInquiryToDrive(id, link);
  }
}
