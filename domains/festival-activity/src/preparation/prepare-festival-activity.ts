import { Duration, IProvidePeriod, Period } from "@overbookd/period";
import {
  ContractorNotFound,
  ElectricitySupplyAlreadyExists,
  ElectricitySupplyNotFound,
  FestivalActivityNotFound,
  TimeWindowAlreadyExists,
} from "../festival-activity.error";
import {
  PrepareContractorCreation,
  PrepareContractorUpdate,
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
  PrepareGeneralUpdate,
  PrepareInChargeUpdate,
  PrepareInquiryRequestCreation,
  PrepareSignaUpdate,
  PrepareSignageCreation,
  PrepareSignageUpdate,
  PrepareSupplyUpdate,
} from "./prepare-festival-activity.model";
import {
  Contractor,
  ElectricityConnection,
  ElectricitySupply,
  FestivalActivity,
  InquiryRequest,
  PreviewFestivalActivity,
  Signage,
  TimeWindow,
  isDraft,
} from "../festival-activity";
import { PrepareInReviewFestivalActivity } from "./prepare-in-review-festival-activity";
import { PrepareDraftFestivalActivity } from "./prepare-draft-festival-activity";
import { updateItemToList } from "@overbookd/list";
import { SlugifyService } from "@overbookd/slugify";

export type PrepareFestivalActivityRepository = {
  findAll(): Promise<PreviewFestivalActivity[]>;
  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null>;
  save(activity: FestivalActivity): Promise<FestivalActivity>;
};

export type Prepare<T extends FestivalActivity> = {
  updateGeneral(general: PrepareGeneralUpdate): T;
  addGeneralTimeWindow(period: IProvidePeriod): T;
  removeGeneralTimeWindow(id: TimeWindow["id"]): T;
  updateInCharge(inCharge: PrepareInChargeUpdate): T;
  addContractor(contractor: PrepareContractorCreation): T;
  updateContractor(contractor: PrepareContractorUpdate): T;
  removeContractor(id: Contractor["id"]): T;
  updateSigna(signa: PrepareSignaUpdate): T;
  addSignage(signage: PrepareSignageCreation): T;
  updateSignage(signage: PrepareSignageUpdate): T;
  removeSignage(id: Signage["id"]): T;
  updateSecurity(security: FestivalActivity["security"]): T;
  updateSupply(supply: PrepareSupplyUpdate): T;
  addElectricitySupply(electricitySupply: PrepareElectricitySupplyCreation): T;
  updateElectricitySupply(electricitySupply: PrepareElectricitySupplyUpdate): T;
  removeElectricitySupply(electricitySupplyId: ElectricitySupply["id"]): T;
  addInquiryTimeWindow(period: IProvidePeriod): T;
  removeInquiryTimeWindow(id: TimeWindow["id"]): T;
  addInquiry(inquiry: PrepareInquiryRequestCreation): T;
  initInquiry(initializer: InitInquiry): T;
  removeInquiry(slug: InquiryRequest["slug"]): T;
};

export type InitInquiry = {
  timeWindow: IProvidePeriod;
  request: PrepareInquiryRequestCreation;
};

export class PrepareFestivalActivity {
  constructor(
    private readonly festivalActivities: PrepareFestivalActivityRepository,
  ) {}

  findAll(): Promise<PreviewFestivalActivity[]> {
    return this.festivalActivities.findAll();
  }

  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null> {
    return this.festivalActivities.findById(id);
  }

  private getPrepareHelper(existingFA: FestivalActivity) {
    return isDraft(existingFA)
      ? PrepareDraftFestivalActivity.build(existingFA)
      : PrepareInReviewFestivalActivity.build(existingFA);
  }

  async updateGeneralSection(
    id: FestivalActivity["id"],
    general: PrepareGeneralUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateGeneral(general);
    return this.festivalActivities.save(updatedFA);
  }

  async addTimeWindowInGeneral(
    faId: FestivalActivity["id"],
    period: IProvidePeriod,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addGeneralTimeWindow(period);
    return this.festivalActivities.save(updatedFA);
  }

  async removeTimeWindowFromGeneral(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeGeneralTimeWindow(timeWindowId);
    return this.festivalActivities.save(updatedFA);
  }

  async updateInChargeSection(
    id: FestivalActivity["id"],
    inCharge: PrepareInChargeUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateInCharge(inCharge);
    return this.festivalActivities.save(updatedFA);
  }

  async addContractor(
    faId: FestivalActivity["id"],
    contractor: PrepareContractorCreation,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addContractor(contractor);
    return this.festivalActivities.save(updatedFA);
  }

  async updateContractor(
    faId: FestivalActivity["id"],
    contractor: PrepareContractorUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateContractor(contractor);
    return this.festivalActivities.save(updatedFA);
  }

  async removeContractor(
    faId: FestivalActivity["id"],
    contractorId: Contractor["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeContractor(contractorId);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSignaSection(
    id: FestivalActivity["id"],
    signa: PrepareSignaUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSigna(signa);
    return this.festivalActivities.save(updatedFA);
  }

  async addSignage(
    faId: number,
    signage: PrepareSignageCreation,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addSignage(signage);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSignage(
    faId: number,
    signage: PrepareSignageUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSignage(signage);
    return this.festivalActivities.save(updatedFA);
  }

  async removeSignage(
    faId: number,
    signageId: Signage["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeSignage(signageId);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSecuritySection(
    id: FestivalActivity["id"],
    security: FestivalActivity["security"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSecurity(security);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSupplySection(
    id: FestivalActivity["id"],
    supply: PrepareSupplyUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSupply(supply);
    return this.festivalActivities.save(updatedFA);
  }

  async addElectricitySupply(
    faId: FestivalActivity["id"],
    electricitySupply: PrepareElectricitySupplyCreation,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addElectricitySupply(electricitySupply);
    return this.festivalActivities.save(updatedFA);
  }

  async updateElectricitySupply(
    faId: FestivalActivity["id"],
    electricitySupply: PrepareElectricitySupplyUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateElectricitySupply(electricitySupply);
    return this.festivalActivities.save(updatedFA);
  }

  async removeElectricitySupply(
    faId: FestivalActivity["id"],
    electricitySupplyId: ElectricitySupply["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeElectricitySupply(electricitySupplyId);
    return this.festivalActivities.save(updatedFA);
  }

  async initInquiry(
    faId: FestivalActivity["id"],
    inquiryInitializer: InitInquiry,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.initInquiry(inquiryInitializer);
    return this.festivalActivities.save(updatedFA);
  }

  async addTimeWindowInInquiry(
    faId: FestivalActivity["id"],
    period: IProvidePeriod,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addInquiryTimeWindow(period);
    return this.festivalActivities.save(updatedFA);
  }

  async removeTimeWindowFromInquiry(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeInquiryTimeWindow(timeWindowId);
    return this.festivalActivities.save(updatedFA);
  }

  async addInquiryRequest(
    faId: number,
    inquiry: PrepareInquiryRequestCreation,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addInquiry(inquiry);
    return this.festivalActivities.save(updatedFA);
  }

  async removeInquiryRequest(
    faId: number,
    slug: InquiryRequest["slug"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeInquiry(slug);
    return this.festivalActivities.save(updatedFA);
  }

  private async findActivityIfExists(id: number): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new FestivalActivityNotFound(id);
    return existingFA;
  }
}

export class TimeWindows<T extends TimeWindow[]> {
  private constructor(private readonly timeWindows: T) {}

  get entries(): T {
    return this.timeWindows;
  }

  static build<U extends TimeWindow[]>(timeWindows: U): TimeWindows<U> {
    return new TimeWindows(timeWindows);
  }

  add(period: IProvidePeriod): TimeWindows<[TimeWindow, ...TimeWindow[]]> {
    const { start, end } = Period.init(period);
    const id = this.generateTimeWindowId({ start, end });
    const timeWindow = { id, start, end };

    const alreadyExists = this.timeWindows.some((tw) => tw.id === id);
    if (alreadyExists) throw new TimeWindowAlreadyExists();

    return new TimeWindows<[TimeWindow, ...TimeWindow[]]>([
      timeWindow,
      ...this.timeWindows,
    ]);
  }

  remove(id: TimeWindow["id"]): TimeWindows<TimeWindow[]> {
    return new TimeWindows(this.timeWindows.filter((tw) => tw.id !== id));
  }

  private generateTimeWindowId(period: IProvidePeriod): TimeWindow["id"] {
    const { start, end } = period;
    const startMinutes = Duration.ms(start.getTime()).inMinutes;
    const endMinutes = Duration.ms(end.getTime()).inMinutes;

    return `${startMinutes}-${endMinutes}`;
  }
}

export class Contractors {
  private constructor(private readonly contractors: Contractor[]) {}

  get entries(): Contractor[] {
    return this.contractors;
  }

  static build(contractors: Contractor[]): Contractors {
    return new Contractors(contractors);
  }

  add(form: PrepareContractorCreation): Contractors {
    const id = this.generateContractorId();
    const contractor = {
      ...form,
      id,
      email: form.email ?? null,
      company: form.company ?? null,
      comment: form.comment ?? null,
    };

    return new Contractors([...this.contractors, contractor]);
  }

  update(contractor: PrepareContractorUpdate): Contractors {
    const currentContractorIndex = this.contractors.findIndex(
      (c) => c.id === contractor.id,
    );
    const currentContractor = this.contractors.at(currentContractorIndex);
    if (currentContractorIndex === -1 || !currentContractor) {
      throw new ContractorNotFound();
    }

    const updatedContractor = this.generateUpdatedContractor(
      currentContractor,
      contractor,
    );

    const contractors = updateItemToList(
      this.contractors,
      currentContractorIndex,
      updatedContractor,
    );
    return new Contractors(contractors);
  }

  remove(id: Contractor["id"]): Contractors {
    return new Contractors(this.contractors.filter((c) => c.id !== id));
  }

  private generateContractorId(): Contractor["id"] {
    const lastContractorId = this.contractors.at(-1)?.id ?? 0;
    return lastContractorId + 1;
  }

  private generateUpdatedContractor(
    previousContractor: Contractor,
    form: PrepareContractorUpdate,
  ): Contractor {
    const updatedContractor = {
      ...previousContractor,
      firstname: form.firstname ?? previousContractor.firstname,
      lastname: form.lastname ?? previousContractor.lastname,
      phone: form.phone ?? previousContractor.phone,
      email: form.email === undefined ? previousContractor.email : form.email,
      company:
        form.company === undefined ? previousContractor.company : form.company,
      comment:
        form.comment === undefined ? previousContractor.comment : form.comment,
    };

    return updatedContractor;
  }
}

export class ElectricitySupplies {
  private constructor(
    private readonly electricitySupplies: ElectricitySupply[],
  ) {}

  get entries(): ElectricitySupply[] {
    return this.electricitySupplies;
  }

  static build(supplies: ElectricitySupply[]): ElectricitySupplies {
    return new ElectricitySupplies(supplies);
  }

  add(form: PrepareElectricitySupplyCreation): ElectricitySupplies {
    const id = this.generateElectricitySupplyId(form.device, form.connection);
    const comment = form.comment ?? null;
    const supply = { ...form, id, comment };

    this.throwIfAlreadyExists(id);

    return new ElectricitySupplies([...this.electricitySupplies, supply]);
  }

  update(form: PrepareElectricitySupplyUpdate): ElectricitySupplies {
    const currentSupplyIndex = this.electricitySupplies.findIndex(
      (es) => es.id === form.id,
    );
    const currentSupply = this.electricitySupplies.at(currentSupplyIndex);
    if (currentSupplyIndex === -1 || !currentSupply) {
      throw new ElectricitySupplyNotFound();
    }

    const updatedSupply = this.generateUpdatedSupply(currentSupply, form);

    if (currentSupply.id !== updatedSupply.id) {
      this.throwIfAlreadyExists(updatedSupply.id);
    }

    const electricitySupplies = updateItemToList(
      this.electricitySupplies,
      currentSupplyIndex,
      updatedSupply,
    );
    return new ElectricitySupplies(electricitySupplies);
  }

  remove(id: ElectricitySupply["id"]): ElectricitySupplies {
    return new ElectricitySupplies(
      this.electricitySupplies.filter((es) => es.id !== id),
    );
  }

  private generateElectricitySupplyId(
    device: string,
    connection: ElectricityConnection,
  ): ElectricitySupply["id"] {
    const supplyId = SlugifyService.apply(`${device} ${connection}`);
    return supplyId;
  }

  private throwIfAlreadyExists(id: string) {
    const alreadyExists = this.electricitySupplies.some((es) => es.id === id);
    if (alreadyExists) throw new ElectricitySupplyAlreadyExists();
  }

  private generateUpdatedSupply(
    previousSupply: ElectricitySupply,
    form: PrepareElectricitySupplyUpdate,
  ): ElectricitySupply {
    const updatedSupply = {
      ...previousSupply,
      connection: form.connection ?? previousSupply.connection,
      device: form.device ?? previousSupply.device,
      power: form.power ?? previousSupply.power,
      count: form.count ?? previousSupply.count,
      comment:
        form.comment === undefined ? previousSupply.comment : form.comment,
    };

    const id = this.generateElectricitySupplyId(
      updatedSupply.device,
      updatedSupply.connection,
    );

    return { ...updatedSupply, id };
  }
}
