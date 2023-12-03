import { Injectable } from "@nestjs/common";
import {
  Adherent,
  AskForReview,
  CreateFestivalActivity,
  Draft,
  Location,
  FestivalActivity,
  PrepareFestivalActivity,
  PrepareGeneralUpdate,
  PrepareSupplyUpdate,
  PreviewFestivalActivity,
  TimeWindow,
  Signage,
  ElectricitySupply,
  PrepareElectricitySupplyCreation,
  PrepareSignageCreation,
  InquiryOwner,
  InquiryRequest,
  PrepareContractorCreation,
  Contractor,
  PrepareFeedbackPublish,
} from "@overbookd/festival-activity";
import {
  AddInquiryRequest,
  PrepareInChargeForm,
  PrepareSignaForm,
} from "@overbookd/http";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";
import { DomainEventService } from "../domain-event/domain-event.service";
import { FestivalActivity as FestivalActivityEvents } from "@overbookd/domain-events";
import { IProvidePeriod } from "@overbookd/period";
import {
  InitInquiryRequest,
  UpdateContractorRequest,
  UpdateElectricitySupplyRequest,
  UpdateSignageRequest,
} from "./dto/update-festival-activity.request.dto";
import { PeriodDto } from "./dto/period.dto";

export type Adherents = {
  find(id: number): Promise<Adherent | null>;
};

export type Locations = {
  find(id: number): Promise<Location | null>;
};

export type Gear = {
  slug: string;
  name: string;
  owner: InquiryOwner;
};

export type Inquiries = {
  find(slug: string): Promise<Gear>;
};

@Injectable()
export class FestivalActivityService {
  constructor(
    private readonly adherents: Adherents,
    private readonly locations: Locations,
    private readonly inquiries: Inquiries,
    private readonly createFestivalActivity: CreateFestivalActivity,
    private readonly prepareFestivalActivity: PrepareFestivalActivity,
    private readonly askForReviewFestivalActivity: AskForReview,
    private readonly eventStore: DomainEventService,
  ) {}

  findAll(): Promise<PreviewFestivalActivity[]> {
    return this.prepareFestivalActivity.findAll();
  }

  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null> {
    return this.prepareFestivalActivity.findById(id);
  }

  async create({ id }: JwtPayload, name: string): Promise<Draft> {
    const author = await this.adherents.find(id);
    const created = await this.createFestivalActivity.create({
      author,
      name,
    });
    this.eventStore.publish(FestivalActivityEvents.created(created));
    return created.festivalActivity;
  }

  async askForReview(
    id: FestivalActivity["id"],
    user: JwtPayload,
  ): Promise<FestivalActivity> {
    const ready = await this.askForReviewFestivalActivity.fromDraft(
      id,
      user.id,
    );
    this.eventStore.publish(FestivalActivityEvents.readyToReview(ready));
    return ready.festivalActivity;
  }

  saveGeneralSection(
    id: FestivalActivity["id"],
    general: PrepareGeneralUpdate,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateGeneralSection(id, general);
  }

  addGeneralTimeWindow(
    id: FestivalActivity["id"],
    timeWindow: IProvidePeriod,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.addTimeWindowInGeneral(id, timeWindow);
  }

  removeGeneralTimeWindow(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.removeTimeWindowFromGeneral(
      faId,
      timeWindowId,
    );
  }

  async saveInChargeSection(
    id: FestivalActivity["id"],
    inCharge: PrepareInChargeForm,
  ): Promise<FestivalActivity> {
    const adherent = inCharge.adherentId
      ? { adherent: await this.adherents.find(inCharge.adherentId) }
      : {};

    return this.prepareFestivalActivity.updateInChargeSection(id, {
      ...inCharge,
      ...adherent,
    });
  }

  addContractor(
    id: FestivalActivity["id"],
    contractor: PrepareContractorCreation,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.addContractor(id, contractor);
  }

  updateContractor(
    faId: FestivalActivity["id"],
    contractorId: Contractor["id"],
    contractorUpdate: UpdateContractorRequest,
  ): Promise<FestivalActivity> {
    const contractor = { id: contractorId, ...contractorUpdate };
    return this.prepareFestivalActivity.updateContractor(faId, contractor);
  }

  removeContractor(
    faId: FestivalActivity["id"],
    contractorId: Contractor["id"],
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.removeContractor(faId, contractorId);
  }

  async saveSignaSection(
    id: FestivalActivity["id"],
    signa: PrepareSignaForm,
  ): Promise<FestivalActivity> {
    const location = signa.locationId
      ? await this.locations.find(signa.locationId)
      : null;

    return this.prepareFestivalActivity.updateSignaSection(id, { location });
  }

  addSignage(
    id: FestivalActivity["id"],
    signage: PrepareSignageCreation,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.addSignage(id, signage);
  }

  updateSignage(
    faId: FestivalActivity["id"],
    signageId: Signage["id"],
    signageUpdate: UpdateSignageRequest,
  ): Promise<FestivalActivity> {
    const signage = { id: signageId, ...signageUpdate };
    return this.prepareFestivalActivity.updateSignage(faId, signage);
  }

  removeSignage(
    faId: FestivalActivity["id"],
    signageId: Signage["id"],
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.removeSignage(faId, signageId);
  }

  saveSecuritySection(
    id: FestivalActivity["id"],
    security: FestivalActivity["security"],
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateSecuritySection(id, security);
  }

  saveSupplySection(
    id: FestivalActivity["id"],
    supply: PrepareSupplyUpdate,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateSupplySection(id, supply);
  }

  addElectricitySupply(
    id: FestivalActivity["id"],
    electricitySupply: PrepareElectricitySupplyCreation,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.addElectricitySupply(
      id,
      electricitySupply,
    );
  }

  updateElectricitySupply(
    faId: FestivalActivity["id"],
    electricitySupplyId: ElectricitySupply["id"],
    electricitySupplyUpdate: UpdateElectricitySupplyRequest,
  ): Promise<FestivalActivity> {
    const electricitySupply = {
      id: electricitySupplyId,
      ...electricitySupplyUpdate,
    };
    return this.prepareFestivalActivity.updateElectricitySupply(
      faId,
      electricitySupply,
    );
  }

  removeElectricitySupply(
    faId: FestivalActivity["id"],
    electricitySupplyId: ElectricitySupply["id"],
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.removeElectricitySupply(
      faId,
      electricitySupplyId,
    );
  }

  async initInquiry(
    faId: FestivalActivity["id"],
    inquiryInitializer: InitInquiryRequest,
  ) {
    const inquiry = await this.inquiries.find(inquiryInitializer.request.slug);

    const request = { ...inquiryInitializer.request, ...inquiry };
    const initializer = { ...inquiryInitializer, request };
    return this.prepareFestivalActivity.initInquiry(faId, initializer);
  }

  addInquiryTimeWindow(faId: FestivalActivity["id"], timeWindow: PeriodDto) {
    return this.prepareFestivalActivity.addTimeWindowInInquiry(
      faId,
      timeWindow,
    );
  }

  removeInquiryTimeWindow(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
  ) {
    return this.prepareFestivalActivity.removeTimeWindowFromInquiry(
      faId,
      timeWindowId,
    );
  }

  async addInquiryRequest(
    faId: FestivalActivity["id"],
    inquiryRequest: AddInquiryRequest,
  ) {
    const inquiry = await this.inquiries.find(inquiryRequest.slug);
    const request = { ...inquiryRequest, ...inquiry };

    return this.prepareFestivalActivity.addInquiryRequest(faId, request);
  }

  removeInquiryRequest(
    faId: FestivalActivity["id"],
    slug: InquiryRequest["slug"],
  ) {
    return this.prepareFestivalActivity.removeInquiryRequest(faId, slug);
  }

  async addFeedback(
    faId: FestivalActivity["id"],
    { id }: JwtPayload,
    { content }: PrepareFeedbackPublish,
  ): Promise<FestivalActivity> {
    const author = await this.adherents.find(id);

    return this.prepareFestivalActivity.publishFeedback(faId, {
      author,
      content,
    });
  }
}
