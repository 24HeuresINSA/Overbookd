import { Duration, IProvidePeriod, Period } from "@overbookd/period";
import {
  FestivalActivityNotFound,
  TimeWindowAlreadyExists,
} from "../festival-activity.error";
import {
  PrepareGeneralForm,
  PrepareInChargeForm,
  PrepareSecurityForm,
  PrepareSignaForm,
  PrepareSupplyForm,
} from "./prepare-festival-activity.model";
import {
  DRAFT,
  Draft,
  FestivalActivity,
  IN_REVIEW,
  InReview,
  PreviewFestivalActivity,
  TimeWindow,
  isDraft,
} from "../festival-activity";

export interface PrepareFestivalActivityRepository {
  findAll(): Promise<PreviewFestivalActivity[]>;
  findById(id: number): Promise<FestivalActivity | null>;
  save(activity: FestivalActivity): Promise<FestivalActivity>;
}

type Prepare<T extends FestivalActivity> = {
  updateGeneral(general: PrepareGeneralForm): T;
  addGeneralTimeWindow(period: IProvidePeriod): T;
  removeGeneralTimeWindow(id: TimeWindow["id"]): T;
  updateInCharge(inCharge: PrepareInChargeForm): T;
  updateSigna(signa: PrepareSignaForm): T;
  updateSecurity(security: PrepareSecurityForm): T;
  updateSupply(supply: PrepareSupplyForm): T;
};

class PrepareDraftFestivalActivity implements Draft, Prepare<Draft> {
  private constructor(
    readonly id: Draft["id"],
    readonly general: Draft["general"],
    readonly inCharge: Draft["inCharge"],
    readonly signa: Draft["signa"],
    readonly security: Draft["security"],
    readonly supply: Draft["supply"],
    readonly inquiry: Draft["inquiry"],
  ) {}

  get status(): typeof DRAFT {
    return DRAFT;
  }

  static build(activity: Draft): PrepareDraftFestivalActivity {
    const { id, general, inCharge, signa, security, supply, inquiry } =
      activity;
    return new PrepareDraftFestivalActivity(
      id,
      general,
      inCharge,
      signa,
      security,
      supply,
      inquiry,
    );
  }

  private get festivalActivity(): Draft {
    return {
      id: this.id,
      status: this.status,
      general: this.general,
      inCharge: this.inCharge,
      signa: this.signa,
      security: this.security,
      supply: this.supply,
      inquiry: this.inquiry,
    };
  }

  updateGeneral(form: PrepareGeneralForm): Draft {
    const privateFestivalActivity = {
      toPublish: false,
      photoLink: null,
      isFlagship: false,
    };
    const cleanedUpdate =
      form.toPublish === false ? { ...form, ...privateFestivalActivity } : form;

    const general = { ...this.general, ...cleanedUpdate };
    return { ...this.festivalActivity, general };
  }

  addGeneralTimeWindow(period: IProvidePeriod): Draft {
    const id = generateTimeWindowId(this.id, period);
    const { start, end } = Period.init(period);
    const timeWindow = { id, start, end };

    const alreadyExists = this.general.timeWindows.some((tw) => tw.id === id);
    if (alreadyExists) throw new TimeWindowAlreadyExists();

    const timeWindows = [...this.general.timeWindows, timeWindow];
    const general = { ...this.general, timeWindows };
    return { ...this.festivalActivity, general };
  }

  removeGeneralTimeWindow(id: TimeWindow["id"]): Draft {
    const timeWindows = this.general.timeWindows.filter((tw) => tw.id !== id);
    const general = { ...this.general, timeWindows };
    return { ...this.festivalActivity, general };
  }

  updateInCharge(form: PrepareInChargeForm): Draft {
    const inCharge = { ...this.inCharge, ...form };
    return { ...this.festivalActivity, inCharge };
  }

  updateSigna(form: PrepareSignaForm): Draft {
    const signa = { ...this.signa, ...form };
    return { ...this.festivalActivity, signa };
  }

  updateSecurity(form: PrepareSecurityForm): Draft {
    const security = { ...this.security, ...form };
    return { ...this.festivalActivity, security };
  }

  updateSupply(form: PrepareSupplyForm): Draft {
    const supply = { ...this.supply, ...form };
    return { ...this.festivalActivity, supply };
  }
}

class PrepareInReviewFestivalActivity implements InReview, Prepare<InReview> {
  private constructor(
    public id: InReview["id"],
    public general: InReview["general"],
    public inCharge: InReview["inCharge"],
    public signa: InReview["signa"],
    public security: InReview["security"],
    public supply: InReview["supply"],
    public inquiry: InReview["inquiry"],
  ) {}

  get status(): typeof IN_REVIEW {
    return IN_REVIEW;
  }

  private get festivalActivity(): InReview {
    return {
      id: this.id,
      status: this.status,
      general: this.general,
      inCharge: this.inCharge,
      signa: this.signa,
      security: this.security,
      supply: this.supply,
      inquiry: this.inquiry,
    };
  }

  static build(activity: InReview): PrepareInReviewFestivalActivity {
    const { id, general, inCharge, signa, security, supply, inquiry } =
      activity;
    return new PrepareInReviewFestivalActivity(
      id,
      general,
      inCharge,
      signa,
      security,
      supply,
      inquiry,
    );
  }

  updateGeneral(general: PrepareGeneralForm): InReview {
    throw new Error("Method not implemented.");
  }

  addGeneralTimeWindow(period: IProvidePeriod): InReview {
    throw new Error("Method not implemented.");
  }

  removeGeneralTimeWindow(id: TimeWindow["id"]): InReview {
    throw new Error("Method not implemented.");
  }

  updateInCharge(inCharge: PrepareInChargeForm): InReview {
    throw new Error("Method not implemented.");
  }

  updateSigna(signa: PrepareSignaForm): InReview {
    throw new Error("Method not implemented.");
  }

  updateSecurity(security: PrepareSecurityForm): InReview {
    throw new Error("Method not implemented.");
  }

  updateSupply(supply: PrepareSupplyForm): InReview {
    throw new Error("Method not implemented.");
  }
}

function generateTimeWindowId(faId: number, period: IProvidePeriod): string {
  const { start, end } = period;
  const startMinutes = Duration.ms(start.getTime()).inMinutes;
  const endMinutes = Duration.ms(end.getTime()).inMinutes;

  return `${faId}-${startMinutes}-${endMinutes}`;
}

export class PrepareFestivalActivity {
  constructor(
    private readonly festivalActivities: PrepareFestivalActivityRepository,
  ) {}

  async updateGeneralSection(
    id: number,
    general: PrepareGeneralForm,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateGeneral(general);
    return this.festivalActivities.save(updatedFA);
  }

  private getPrepareHelper(existingFA: FestivalActivity) {
    return isDraft(existingFA)
      ? PrepareDraftFestivalActivity.build(existingFA)
      : PrepareInReviewFestivalActivity.build(existingFA);
  }

  async addTimeWindowInGeneral(
    faId: number,
    period: IProvidePeriod,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addGeneralTimeWindow(period);
    return this.festivalActivities.save(updatedFA);
  }

  async removeTimeWindowFromGeneral(
    faId: number,
    timeWindowId: string,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeGeneralTimeWindow(timeWindowId);
    return this.festivalActivities.save(updatedFA);
  }

  async updateInChargeSection(
    id: number,
    inCharge: PrepareInChargeForm,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateInCharge(inCharge);
    console.log(updatedFA.inCharge);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSignaSection(
    id: number,
    signa: PrepareSignaForm,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSigna(signa);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSecuritySection(
    id: number,
    security: PrepareSecurityForm,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSecurity(security);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSupplySection(
    id: number,
    supply: PrepareSupplyForm,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSupply(supply);
    return this.festivalActivities.save(updatedFA);
  }

  private async findActivityIfExists(id: number): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new FestivalActivityNotFound(id);
    return existingFA;
  }
}
