import {
  InitInquiry,
  Prepare,
} from "./prepare-festival-activity";
import { ElectricitySupplies } from "./section-aggregates/electricity-supplies";
import { Contractors } from "./section-aggregates/contractors";
import { TimeWindows } from "./section-aggregates/time-windows";
import { IProvidePeriod } from "@overbookd/period";
import {
  Contractor,
  ElectricitySupply,
  FestivalActivity,
  InReview,
  InquiryRequest,
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
  Signage,
  TimeWindow,
} from "../festival-activity";
import {
  PrepareGeneralUpdate,
  PrepareInChargeUpdate,
  PrepareSignaUpdate,
  PrepareSupplyUpdate,
  PrepareContractorCreation,
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
  PrepareContractorUpdate,
  PrepareInquiryRequestCreation,
  PrepareSignageCreation,
  PrepareSignageUpdate,
} from "./prepare-festival-activity.model";
import { FestivalActivityError } from "../festival-activity.error";
import { hasAtLeastOneItem } from "@overbookd/list";
import {
  AlreadyInitialized,
  CantRemoveLastRequest,
  CantRemoveLastTimeWindow,
  Inquiries,
  NotYetInitialized,
} from "./section-aggregates/inquiries";
import { LocationIsRequired, Signages } from "./section-aggregates/signages";

export class IsNotPublicActivity extends FestivalActivityError {}

export class NeedAtLeastOneTimeWindow extends FestivalActivityError {
  constructor() {
    super("Il faut garder au moins un créneau.");
  }
}

class General {
  private constructor(private readonly general: InReview["general"]) {}

  static init(general: InReview["general"]): General {
    return new General(general);
  }

  update(form: PrepareGeneralUpdate): InReview["general"] {
    const name = form.name ?? this.general.name;
    const description = form.description ?? this.general.description;
    const categories = form.categories ?? this.general.categories;
    const toPublish = form.toPublish ?? this.general.toPublish;
    const isFlagship = form.isFlagship ?? this.general.isFlagship;
    const photoLink = form.photoLink ?? this.general.photoLink;
    const { timeWindows } = this.general;

    if (!toPublish) {
      return {
        ...this.general,
        name,
        description,
        toPublish: false,
        categories,
        isFlagship: false,
        photoLink: null,
      };
    }

    if (!this.hasAtLeastOneCategory(categories)) {
      throw new IsNotPublicActivity("Il faut au moins une catégorie.");
    }
    if (!this.hasSetPhotoLink(photoLink)) {
      throw new IsNotPublicActivity("Il faut définir un lien pour la photo.");
    }
    if (!this.hasAtLeastOneTimeWindow(timeWindows)) {
      throw new IsNotPublicActivity("Il faut au moins un créneau.");
    }

    return {
      name,
      description,
      toPublish,
      categories,
      isFlagship,
      photoLink,
      timeWindows,
    };
  }

  private hasSetPhotoLink(photoLink: string | null): photoLink is string {
    return photoLink !== null;
  }

  private hasAtLeastOneCategory(
    categories: string[],
  ): categories is [string, ...string[]] {
    return hasAtLeastOneItem(categories);
  }

  private hasAtLeastOneTimeWindow(
    timeWindows: TimeWindow[],
  ): timeWindows is [TimeWindow, ...TimeWindow[]] {
    return hasAtLeastOneItem(timeWindows);
  }
}

export class PrepareInReviewFestivalActivity implements Prepare<InReview> {
  private constructor(private readonly activity: InReview) {}

  static build(activity: InReview): PrepareInReviewFestivalActivity {
    return new PrepareInReviewFestivalActivity(activity);
  }

  updateGeneral(form: PrepareGeneralUpdate): InReview {
    const general = General.init(this.activity.general).update(form);
    const reviews: InReview["reviews"] = {
      ...this.activity.reviews,
      comcom: general.toPublish ? REVIEWING : NOT_ASKING_TO_REVIEW,
    };
    return { ...this.activity, general, reviews };
  }

  addGeneralTimeWindow(period: IProvidePeriod): InReview {
    const timeWindows = TimeWindows.build(
      this.activity.general.timeWindows,
    ).add(period).entries;

    const general = { ...this.activity.general, timeWindows };
    return { ...this.activity, general };
  }

  removeGeneralTimeWindow(id: TimeWindow["id"]): InReview {
    const timeWindows = TimeWindows.build(
      this.activity.general.timeWindows,
    ).remove(id).entries;

    if (!hasAtLeastOneItem(timeWindows)) throw new NeedAtLeastOneTimeWindow();

    const general = { ...this.activity.general, timeWindows };
    return { ...this.activity, general };
  }

  updateInCharge(form: PrepareInChargeUpdate): InReview {
    const adherent = form.adherent ?? this.activity.inCharge.adherent;
    const team = form.team ?? this.activity.inCharge.team;

    const inCharge = { ...this.activity.inCharge, adherent, team };
    return { ...this.activity, inCharge };
  }

  addContractor(contractor: PrepareContractorCreation): InReview {
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).add(contractor).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  updateContractor(contractor: PrepareContractorUpdate): InReview {
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).update(contractor).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  removeContractor(id: Contractor["id"]): InReview {
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).remove(id).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  updateSigna({ location }: PrepareSignaUpdate): InReview {
    if (location === null) throw new LocationIsRequired();
    const signa = { ...this.activity.signa, location };
    return { ...this.activity, signa };
  }

  addSignage(signage: PrepareSignageCreation): InReview {
    const signages = Signages.build(this.activity.signa.signages).add(
      signage,
    ).entries;
    const signa = { ...this.activity.signa, signages };
    return { ...this.activity, signa };
  }

  updateSignage(signage: PrepareSignageUpdate): InReview {
    const signages = Signages.build(this.activity.signa.signages).update(
      signage,
    ).entries;
    const signa = { ...this.activity.signa, signages };
    return { ...this.activity, signa };
  }

  removeSignage(id: Signage["id"]): InReview {
    const signages = Signages.build(this.activity.signa.signages).remove(
      id,
    ).entries;
    const signa = { ...this.activity.signa, signages };
    return { ...this.activity, signa };
  }

  updateSecurity(security: FestivalActivity["security"]): InReview {
    return { ...this.activity, security };
  }

  updateSupply(form: PrepareSupplyUpdate): InReview {
    const supply = { ...this.activity.supply, ...form };
    return { ...this.activity, supply };
  }

  addElectricitySupply(
    electricitySupply: PrepareElectricitySupplyCreation,
  ): InReview {
    const electricity = ElectricitySupplies.build(
      this.activity.supply.electricity,
    ).add(electricitySupply).entries;

    const supply = { ...this.activity.supply, electricity };
    return { ...this.activity, supply };
  }

  updateElectricitySupply(
    electricitySupply: PrepareElectricitySupplyUpdate,
  ): InReview {
    const electricity = ElectricitySupplies.build(
      this.activity.supply.electricity,
    ).update(electricitySupply).entries;

    const supply = { ...this.activity.supply, electricity };
    return { ...this.activity, supply };
  }

  removeElectricitySupply(id: ElectricitySupply["id"]): InReview {
    const electricity = ElectricitySupplies.build(
      this.activity.supply.electricity,
    ).remove(id).entries;

    const supply = { ...this.activity.supply, electricity };
    return { ...this.activity, supply };
  }

  initInquiry({ request, timeWindow }: InitInquiry): InReview {
    if (Inquiries.alreadyInitialized(this.activity.inquiry)) {
      throw new AlreadyInitialized();
    }
    const inquiry = Inquiries.init()
      .addRequest(request)
      .addTimeWindow(timeWindow).inquiry;

    return { ...this.activity, inquiry };
  }

  addInquiryTimeWindow(period: IProvidePeriod): InReview {
    this.checkIfAlreadyInitialized();

    const inquiry = Inquiries.build(this.activity.inquiry).addTimeWindow(
      period,
    ).inquiry;

    return { ...this.activity, inquiry };
  }

  removeInquiryTimeWindow(id: string): InReview {
    const inquiry = Inquiries.build(this.activity.inquiry).removeTimeWindow(
      id,
    ).inquiry;

    if (this.hasNoTimeWindowRemaining(inquiry)) {
      throw new CantRemoveLastTimeWindow();
    }

    return { ...this.activity, inquiry };
  }

  private hasNoTimeWindowRemaining(inquiry: FestivalActivity["inquiry"]) {
    return inquiry.timeWindows.length === 0;
  }

  addInquiry(request: PrepareInquiryRequestCreation): InReview {
    this.checkIfAlreadyInitialized();
    const inquiry = Inquiries.build(this.activity.inquiry).addRequest(
      request,
    ).inquiry;

    return { ...this.activity, inquiry };
  }

  private checkIfAlreadyInitialized() {
    if (!Inquiries.alreadyInitialized(this.activity.inquiry)) {
      throw new NotYetInitialized();
    }
  }

  removeInquiry(slug: InquiryRequest["slug"]): InReview {
    const inquiry = Inquiries.build(this.activity.inquiry).removeRequest(
      slug,
    ).inquiry;

    if (this.hasNoRequestRemaining(inquiry)) {
      throw new CantRemoveLastRequest();
    }

    return { ...this.activity, inquiry };
  }

  private hasNoRequestRemaining(inquiry: FestivalActivity["inquiry"]) {
    const requests = [
      ...inquiry.gears,
      ...inquiry.barriers,
      ...inquiry.electricity,
    ];
    return requests.length === 0;
  }
}
