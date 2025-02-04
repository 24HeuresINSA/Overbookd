import { Injectable, NotFoundException } from "@nestjs/common";
import {
  Drive,
  FestivalActivity,
  InquiryRequest,
  PrepareFestivalActivity,
  TimeWindow,
} from "@overbookd/festival-event";
import {
  InitInquiryRequest,
  AddInquiryRequestForm,
  UpdateInquiryRequestForm,
} from "@overbookd/http";
import { JwtUtil } from "../../../../authentication/entities/jwt-util.entity";
import { Inquiries } from "../../common/festival-activity-common.model";
import { TeamService } from "../../../../team/team.service";
import { IProvidePeriod } from "@overbookd/time";

type LinkDriveToInquiryRequest = {
  activityId: FestivalActivity["id"];
  slug: InquiryRequest["slug"];
  drive: Drive;
};

@Injectable()
export class InquirySectionService {
  constructor(
    private readonly inquiries: Inquiries,
    private readonly prepare: PrepareFestivalActivity,
  ) {}

  async initInquiry(
    faId: FestivalActivity["id"],
    inquiryInitializer: InitInquiryRequest,
  ) {
    const inquiry = await this.inquiries.find(inquiryInitializer.request.slug);
    if (!inquiry) {
      throw new NotFoundException("Le matos demandé n'existe pas");
    }

    const request = { ...inquiryInitializer.request, ...inquiry };
    const initializer = { ...inquiryInitializer, request };
    return this.prepare.initInquiry(faId, initializer);
  }

  async clearInquiry(faId: FestivalActivity["id"]): Promise<FestivalActivity> {
    return this.prepare.clearInquiry(faId);
  }

  addInquiryTimeWindow(
    faId: FestivalActivity["id"],
    timeWindow: IProvidePeriod,
  ) {
    return this.prepare.addTimeWindowInInquiry(faId, timeWindow);
  }

  updateInquiryTimeWindow(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
    period: IProvidePeriod,
  ) {
    return this.prepare.updateTimeWindowInInquiry(faId, timeWindowId, period);
  }

  removeInquiryTimeWindow(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
  ) {
    return this.prepare.removeTimeWindowFromInquiry(faId, timeWindowId);
  }

  async addInquiryRequest(
    faId: FestivalActivity["id"],
    { slug, quantity }: AddInquiryRequestForm,
  ) {
    const gear = await this.inquiries.find(slug);
    if (!gear) throw new NotFoundException("Le matos recherché n'existe pas");

    const request = { ...gear, quantity };
    return this.prepare.addInquiryRequest(faId, request);
  }

  async updateInquiryRequest(
    faId: FestivalActivity["id"],
    slug: InquiryRequest["slug"],
    { quantity }: UpdateInquiryRequestForm,
  ) {
    const gear = await this.inquiries.find(slug);
    if (!gear) throw new NotFoundException("Le matos recherché n'existe pas");

    const request = { ...gear, quantity };
    return this.prepare.updateInquiryRequest(faId, request);
  }

  async removeInquiryRequest(
    faId: FestivalActivity["id"],
    slug: InquiryRequest["slug"],
  ) {
    const inquiry = await this.inquiries.find(slug);
    return this.prepare.removeInquiryRequest(faId, {
      slug,
      owner: inquiry.owner,
    });
  }

  async linkInquiryRequestToDrive(
    user: JwtUtil,
    { activityId, slug, drive }: LinkDriveToInquiryRequest,
  ): Promise<FestivalActivity> {
    const gear = await this.inquiries.find(slug);
    if (!gear) throw new NotFoundException("Le matos recherché n'existe pas");

    TeamService.checkMembership(user, gear.owner);

    return this.prepare.assignInquiryToDrive(activityId, {
      drive,
      slug,
      owner: gear.owner,
    });
  }
}
