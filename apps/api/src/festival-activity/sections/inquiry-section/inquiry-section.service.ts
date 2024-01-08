import { Injectable, NotFoundException } from "@nestjs/common";
import {
  Drive,
  FestivalActivity,
  InquiryRequest,
  PrepareFestivalActivity,
  TimeWindow,
} from "@overbookd/festival-activity";
import { InitInquiryRequest, AddInquiryRequest } from "@overbookd/http";
import { JwtUtil } from "../../../authentication/entities/jwt-util.entity";
import { PeriodDto } from "../../common/dto/period.dto";
import { Inquiries } from "../../common/festival-activity-common.model";
import { TeamService } from "../../../team/team.service";

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
      throw new NotFoundException("❌ Le matos demandé n'existe pas");
    }

    const request = { ...inquiryInitializer.request, ...inquiry };
    const initializer = { ...inquiryInitializer, request };
    return this.prepare.initInquiry(faId, initializer);
  }

  addInquiryTimeWindow(faId: FestivalActivity["id"], timeWindow: PeriodDto) {
    return this.prepare.addTimeWindowInInquiry(faId, timeWindow);
  }

  removeInquiryTimeWindow(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
  ) {
    return this.prepare.removeTimeWindowFromInquiry(faId, timeWindowId);
  }

  async addInquiryRequest(
    faId: FestivalActivity["id"],
    inquiryRequest: AddInquiryRequest,
  ) {
    const inquiry = await this.inquiries.find(inquiryRequest.slug);
    const request = { ...inquiryRequest, ...inquiry };

    return this.prepare.addInquiryRequest(faId, request);
  }

  removeInquiryRequest(
    faId: FestivalActivity["id"],
    slug: InquiryRequest["slug"],
  ) {
    return this.prepare.removeInquiryRequest(faId, slug);
  }

  async linkInquiryRequestToDrive(
    user: JwtUtil,
    { activityId, slug, drive }: LinkDriveToInquiryRequest,
  ): Promise<FestivalActivity> {
    const inquiry = await this.inquiries.find(slug);
    if (!inquiry) {
      throw new NotFoundException("❌ Le matos recherché n'existe pas");
    }

    TeamService.checkMembership(user, inquiry.owner);

    return this.prepare.assignInquiryToDrive(activityId, {
      drive,
      slug,
      owner: inquiry.owner,
    });
  }
}
