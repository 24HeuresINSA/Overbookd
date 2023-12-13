import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
  Reviewing,
  Reviewer,
  Refused,
  Drive,
  SignageCatalogItem,
  signa,
  Reviewable,
} from "@overbookd/festival-activity";
import {
  AddInquiryRequest,
  InitInquiryRequest,
  PrepareInChargeForm,
  PrepareSignaForm,
  ReviewRejection,
} from "@overbookd/http";
import {
  JwtPayload,
  JwtUtil,
} from "../authentication/entities/jwt-util.entity";
import { DomainEventService } from "../domain-event/domain-event.service";
import { FestivalActivity as FestivalActivityEvents } from "@overbookd/domain-events";
import { IProvidePeriod } from "@overbookd/period";
import {
  UpdateContractorRequest,
  UpdateElectricitySupplyRequest,
  UpdateSignageRequest,
} from "./dto/update-festival-activity.request.dto";
import { PeriodDto } from "./dto/period.dto";

export type RemovalFestivalActivity = {
  remove(id: FestivalActivity["id"]): Promise<FestivalActivity>;
};

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
  find(slug: string): Promise<Gear | null>;
};

export type CatalogSignages = {
  find(id: number): Promise<SignageCatalogItem | null>;
};

type LinkDriveToInquiryRequest = {
  activityId: FestivalActivity["id"];
  slug: InquiryRequest["slug"];
  drive: Drive;
};

type LinkSignageToCatalogItem = {
  activityId: FestivalActivity["id"];
  signageId: Signage["id"];
  catalogItemId: SignageCatalogItem["id"];
};

@Injectable()
export class FestivalActivityService {
  constructor(
    private readonly adherents: Adherents,
    private readonly locations: Locations,
    private readonly inquiries: Inquiries,
    private readonly catalogSignages: CatalogSignages,
    private readonly creation: CreateFestivalActivity,
    private readonly prepare: PrepareFestivalActivity,
    private readonly askForReview: AskForReview,
    private readonly removal: RemovalFestivalActivity,
    private readonly reviewing: Reviewing,
    private readonly eventStore: DomainEventService,
  ) {}

  findAll(): Promise<PreviewFestivalActivity[]> {
    return this.prepare.findAll();
  }

  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null> {
    return this.prepare.findById(id);
  }

  async create({ id }: JwtPayload, name: string): Promise<Draft> {
    const author = await this.adherents.find(id);
    const activity = await this.creation.create({
      author,
      name,
    });

    const event = FestivalActivityEvents.created(activity, author.id);
    this.eventStore.publish(event);

    return activity;
  }

  async toReview(
    id: FestivalActivity["id"],
    user: JwtPayload,
  ): Promise<FestivalActivity> {
    const adherent = await this.adherents.find(user.id);
    const activity = await this.askForReview.from(id, adherent);

    const event = FestivalActivityEvents.readyToReview(activity, adherent.id);
    this.eventStore.publish(event);

    return activity;
  }

  async remove(id: FestivalActivity["id"]): Promise<void> {
    await this.removal.remove(id);
  }

  saveGeneralSection(
    id: FestivalActivity["id"],
    general: PrepareGeneralUpdate,
  ): Promise<FestivalActivity> {
    return this.prepare.updateGeneralSection(id, general);
  }

  addGeneralTimeWindow(
    id: FestivalActivity["id"],
    timeWindow: IProvidePeriod,
  ): Promise<FestivalActivity> {
    return this.prepare.addTimeWindowInGeneral(id, timeWindow);
  }

  removeGeneralTimeWindow(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
  ): Promise<FestivalActivity> {
    return this.prepare.removeTimeWindowFromGeneral(faId, timeWindowId);
  }

  async saveInChargeSection(
    id: FestivalActivity["id"],
    inCharge: PrepareInChargeForm,
  ): Promise<FestivalActivity> {
    const adherent = inCharge.adherentId
      ? { adherent: await this.adherents.find(inCharge.adherentId) }
      : {};

    return this.prepare.updateInChargeSection(id, {
      ...inCharge,
      ...adherent,
    });
  }

  addContractor(
    id: FestivalActivity["id"],
    contractor: PrepareContractorCreation,
  ): Promise<FestivalActivity> {
    return this.prepare.addContractor(id, contractor);
  }

  updateContractor(
    faId: FestivalActivity["id"],
    contractorId: Contractor["id"],
    contractorUpdate: UpdateContractorRequest,
  ): Promise<FestivalActivity> {
    const contractor = { id: contractorId, ...contractorUpdate };
    return this.prepare.updateContractor(faId, contractor);
  }

  removeContractor(
    faId: FestivalActivity["id"],
    contractorId: Contractor["id"],
  ): Promise<FestivalActivity> {
    return this.prepare.removeContractor(faId, contractorId);
  }

  async saveSignaSection(
    id: FestivalActivity["id"],
    signa: PrepareSignaForm,
  ): Promise<FestivalActivity> {
    const location = signa.locationId
      ? await this.locations.find(signa.locationId)
      : null;

    return this.prepare.updateSignaSection(id, { location });
  }

  addSignage(
    id: FestivalActivity["id"],
    signage: PrepareSignageCreation,
  ): Promise<FestivalActivity> {
    return this.prepare.addSignage(id, signage);
  }

  updateSignage(
    faId: FestivalActivity["id"],
    signageId: Signage["id"],
    signageUpdate: UpdateSignageRequest,
  ): Promise<FestivalActivity> {
    const signage = { id: signageId, ...signageUpdate };
    return this.prepare.updateSignage(faId, signage);
  }

  removeSignage(
    faId: FestivalActivity["id"],
    signageId: Signage["id"],
  ): Promise<FestivalActivity> {
    return this.prepare.removeSignage(faId, signageId);
  }

  async linkSignageToCatalogItem(
    user: JwtUtil,
    { activityId, signageId, catalogItemId }: LinkSignageToCatalogItem,
  ): Promise<FestivalActivity> {
    const catalogItem = await this.catalogSignages.find(catalogItemId);
    if (!catalogItem) {
      throw new NotFoundException(
        "❌ La signalétique n'existe pas dans le catalogue",
      );
    }

    this.checkMembership(user, signa);

    return this.prepare.linkSignageToCatalogItem(activityId, {
      signageId,
      catalogItem,
    });
  }

  saveSecuritySection(
    id: FestivalActivity["id"],
    security: FestivalActivity["security"],
  ): Promise<FestivalActivity> {
    return this.prepare.updateSecuritySection(id, security);
  }

  saveSupplySection(
    id: FestivalActivity["id"],
    supply: PrepareSupplyUpdate,
  ): Promise<FestivalActivity> {
    return this.prepare.updateSupplySection(id, supply);
  }

  addElectricitySupply(
    id: FestivalActivity["id"],
    electricitySupply: PrepareElectricitySupplyCreation,
  ): Promise<FestivalActivity> {
    return this.prepare.addElectricitySupply(id, electricitySupply);
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
    return this.prepare.updateElectricitySupply(faId, electricitySupply);
  }

  removeElectricitySupply(
    faId: FestivalActivity["id"],
    electricitySupplyId: ElectricitySupply["id"],
  ): Promise<FestivalActivity> {
    return this.prepare.removeElectricitySupply(faId, electricitySupplyId);
  }

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

    this.checkMembership(user, inquiry.owner);

    return this.prepare.assignInquiryToDrive(activityId, {
      drive,
      slug,
      owner: inquiry.owner,
    });
  }

  async addFeedback(
    faId: FestivalActivity["id"],
    { id }: JwtPayload,
    { content }: PrepareFeedbackPublish,
  ): Promise<FestivalActivity> {
    const author = await this.adherents.find(id);

    return this.prepare.publishFeedback(faId, { author, content });
  }

  async approve(
    faId: FestivalActivity["id"],
    user: JwtUtil,
    team: Reviewer,
  ): Promise<Reviewable> {
    this.checkMembership(user, team);

    const approver = await this.adherents.find(user.id);
    const activity = await this.reviewing.approve(faId, team, approver);

    const event = FestivalActivityEvents.approved(activity, approver.id);
    this.eventStore.publish(event);

    return activity;
  }

  async reject(
    faId: number,
    user: JwtUtil,
    rejection: ReviewRejection,
  ): Promise<Refused> {
    this.checkMembership(user, rejection.team);

    const rejector = await this.adherents.find(user.id);
    const withRejector = { ...rejection, rejector };
    const activity = await this.reviewing.reject(faId, withRejector);

    const event = FestivalActivityEvents.rejected(
      activity,
      rejector.id,
      rejection.reason,
    );
    this.eventStore.publish(event);

    return activity;
  }

  private checkMembership(user: JwtUtil, team: string) {
    if (!user.isMemberOf(team)) {
      const notMember = `❌ Tu n'es pas membre de l'équipe ${team}`;
      throw new ForbiddenException(notMember);
    }
  }
}
