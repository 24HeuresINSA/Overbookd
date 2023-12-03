import { InitInquiry, Prepare } from "./prepare-festival-activity";
import { ElectricitySupplies } from "./section-aggregates/electricity-supplies";
import { Contractors } from "./section-aggregates/contractors";
import { TimeWindows } from "./section-aggregates/time-windows";
import { IProvidePeriod } from "@overbookd/period";
import { FestivalActivity, InReview } from "../festival-activity";
import {
  APPROVED,
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
  Reviewer,
  Reviews,
  barrieres,
  communication,
  elec,
  humain,
  matos,
  secu,
  signa,
} from "../sections/reviews";
import { InquiryOwner, InquiryRequest } from "../sections/inquiry";
import { ElectricitySupply } from "../sections/supply";
import { Signage } from "../sections/signa";
import { Contractor } from "../sections/in-charge";
import { TimeWindow } from "../sections/time-window";
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
  LinkInquiryDrive,
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

class IsNotPublicActivity extends FestivalActivityError {
  constructor(missingParts: string[]) {
    const baseError = "❌ Il n'est pas possible de rendre publique cette FA";
    super([baseError, ...missingParts].join("\n"));
  }
}

class NeedAtLeastOneTimeWindow extends FestivalActivityError {
  constructor() {
    super("❌ Il faut garder au moins un créneau.");
  }
}

class AlreadyApprovedBy extends FestivalActivityError {
  constructor(reviewers: Reviewer[]) {
    const plural = reviewers.length > 1;
    const noun = plural ? "les équipes" : "l'équipe";
    const reviewerListing = reviewers.join(" et ");
    super(`❌ La FA a déjà été validée par ${noun} ${reviewerListing}.`);
  }
}

export const PrepareError = {
  IsNotPublicActivity,
  NeedAtLeastOneTimeWindow,
  AlreadyApprovedBy,
};

type isValidatedBy = {
  validated: boolean;
  reviewer: Reviewer;
};

class General {
  private constructor(private readonly general: InReview["general"]) {}

  static init(general: InReview["general"]): General {
    return new General(general);
  }

  isAlreadyValidatedBy(reviews: Reviews): isValidatedBy {
    const reviewer = this.general.toPublish ? communication : humain;
    switch (reviewer) {
      case communication:
        return { validated: reviews.communication === APPROVED, reviewer };
      case humain:
        return { validated: reviews.humain === APPROVED, reviewer };
    }
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

    if (
      !this.hasAtLeastOneCategory(categories) ||
      !this.hasSetPhotoLink(photoLink) ||
      !this.hasAtLeastOneTimeWindow(timeWindows)
    ) {
      const missingPublicParts = [
        {
          verify: this.hasAtLeastOneCategory(categories),
          message: "Il faut au moins une catégorie.",
        },
        {
          verify: this.hasSetPhotoLink(photoLink),
          message: "Il faut définir un lien pour la photo.",
        },
        {
          verify: this.hasAtLeastOneTimeWindow(timeWindows),
          message: "Il faut au moins un créneau.",
        },
      ]
        .filter(({ verify }) => !verify)
        .map(({ message }) => `- ${message}`);

      throw new IsNotPublicActivity(missingPublicParts);
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

type ApproveReducer = {
  approved: boolean;
  teams: InquiryOwner[];
};

export class PrepareInReviewFestivalActivity implements Prepare<InReview> {
  private constructor(private readonly activity: InReview) {}

  static build(activity: InReview): PrepareInReviewFestivalActivity {
    return new PrepareInReviewFestivalActivity(activity);
  }

  updateGeneral(form: PrepareGeneralUpdate): InReview {
    this.checkIfGeneralAlreadyValidated();
    const general = General.init(this.activity.general).update(form);
    const reviews: InReview["reviews"] = {
      ...this.activity.reviews,
      communication: general.toPublish ? REVIEWING : NOT_ASKING_TO_REVIEW,
    };
    return { ...this.activity, general, reviews };
  }

  addGeneralTimeWindow(period: IProvidePeriod): InReview {
    this.checkIfGeneralAlreadyValidated();
    const timeWindows = TimeWindows.build(
      this.activity.general.timeWindows,
    ).add(period).entries;

    const general = { ...this.activity.general, timeWindows };
    return { ...this.activity, general };
  }

  private checkIfGeneralAlreadyValidated() {
    const { validated, reviewer } = General.init(
      this.activity.general,
    ).isAlreadyValidatedBy(this.activity.reviews);

    if (validated) {
      throw new AlreadyApprovedBy([reviewer]);
    }
  }

  removeGeneralTimeWindow(id: TimeWindow["id"]): InReview {
    this.checkIfGeneralAlreadyValidated();
    const timeWindows = TimeWindows.build(
      this.activity.general.timeWindows,
    ).remove(id).entries;

    if (!hasAtLeastOneItem(timeWindows)) throw new NeedAtLeastOneTimeWindow();

    const general = { ...this.activity.general, timeWindows };
    return { ...this.activity, general };
  }

  updateInCharge(form: PrepareInChargeUpdate): InReview {
    this.checkIfInChargeAlreadyValidated();
    const adherent = form.adherent ?? this.activity.inCharge.adherent;
    const team = form.team ?? this.activity.inCharge.team;

    const inCharge = { ...this.activity.inCharge, adherent, team };
    return { ...this.activity, inCharge };
  }

  private checkIfInChargeAlreadyValidated() {
    const isValidated = this.activity.reviews.humain === APPROVED;
    if (isValidated) {
      throw new AlreadyApprovedBy([humain]);
    }
  }

  addContractor(contractor: PrepareContractorCreation): InReview {
    this.checkIfInChargeAlreadyValidated();
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).add(contractor).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  updateContractor(contractor: PrepareContractorUpdate): InReview {
    this.checkIfInChargeAlreadyValidated();
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).update(contractor).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  removeContractor(id: Contractor["id"]): InReview {
    this.checkIfInChargeAlreadyValidated();
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).remove(id).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  updateSigna({ location }: PrepareSignaUpdate): InReview {
    this.checkIfSignaAlreadyValidated();
    if (location === null) throw new LocationIsRequired();
    const signa = { ...this.activity.signa, location };
    return { ...this.activity, signa };
  }

  private checkIfSignaAlreadyValidated() {
    const isValidated = this.activity.reviews.signa === APPROVED;
    if (isValidated) {
      throw new AlreadyApprovedBy([signa]);
    }
  }

  addSignage(signage: PrepareSignageCreation): InReview {
    this.checkIfSignaAlreadyValidated();
    const signages = Signages.build(this.activity.signa.signages).add(
      signage,
    ).entries;
    const signa = { ...this.activity.signa, signages };
    return { ...this.activity, signa };
  }

  updateSignage(signage: PrepareSignageUpdate): InReview {
    this.checkIfSignaAlreadyValidated();
    const signages = Signages.build(this.activity.signa.signages).update(
      signage,
    ).entries;
    const signa = { ...this.activity.signa, signages };
    return { ...this.activity, signa };
  }

  removeSignage(id: Signage["id"]): InReview {
    this.checkIfSignaAlreadyValidated();
    const signages = Signages.build(this.activity.signa.signages).remove(
      id,
    ).entries;
    const signa = { ...this.activity.signa, signages };
    return { ...this.activity, signa };
  }

  updateSecurity(security: FestivalActivity["security"]): InReview {
    this.checkIfSecurityAlreadyValidated();
    return { ...this.activity, security };
  }

  private checkIfSecurityAlreadyValidated() {
    const isValidated = this.activity.reviews.secu === APPROVED;
    if (isValidated) {
      throw new AlreadyApprovedBy([secu]);
    }
  }

  updateSupply(form: PrepareSupplyUpdate): InReview {
    this.checkIfSupplyAlreadyValidated();
    const supply = { ...this.activity.supply, ...form };
    return { ...this.activity, supply };
  }

  private checkIfSupplyAlreadyValidated() {
    const isValidated = this.activity.reviews.elec === APPROVED;
    if (isValidated) {
      throw new AlreadyApprovedBy([elec]);
    }
  }

  addElectricitySupply(
    electricitySupply: PrepareElectricitySupplyCreation,
  ): InReview {
    this.checkIfSupplyAlreadyValidated();
    const electricity = ElectricitySupplies.build(
      this.activity.supply.electricity,
    ).add(electricitySupply).entries;

    const supply = { ...this.activity.supply, electricity };
    return { ...this.activity, supply };
  }

  updateElectricitySupply(
    electricitySupply: PrepareElectricitySupplyUpdate,
  ): InReview {
    this.checkIfSupplyAlreadyValidated();
    const electricity = ElectricitySupplies.build(
      this.activity.supply.electricity,
    ).update(electricitySupply).entries;

    const supply = { ...this.activity.supply, electricity };
    return { ...this.activity, supply };
  }

  removeElectricitySupply(id: ElectricitySupply["id"]): InReview {
    this.checkIfSupplyAlreadyValidated();
    const electricity = ElectricitySupplies.build(
      this.activity.supply.electricity,
    ).remove(id).entries;

    const supply = { ...this.activity.supply, electricity };
    return { ...this.activity, supply };
  }

  initInquiry({ request, timeWindow }: InitInquiry): InReview {
    this.checkIfInquiryAlreadyValidatedBy();
    if (Inquiries.alreadyInitialized(this.activity.inquiry)) {
      throw new AlreadyInitialized();
    }
    const inquiry = Inquiries.init()
      .addRequest(request)
      .addTimeWindow(timeWindow).inquiry;

    return { ...this.activity, inquiry };
  }

  addInquiryTimeWindow(period: IProvidePeriod): InReview {
    this.checkIfInquiryAlreadyValidatedBy();
    this.checkIfAlreadyInitialized();

    const inquiry = Inquiries.build(this.activity.inquiry).addTimeWindow(
      period,
    ).inquiry;

    return { ...this.activity, inquiry };
  }

  private checkIfInquiryAlreadyValidatedBy(owner?: InquiryOwner) {
    const { approved, teams } = this.isInquiryApprovedBy(owner);
    if (approved) {
      throw new AlreadyApprovedBy(teams);
    }
  }

  private isInquiryApprovedBy(owner: InquiryOwner | undefined): ApproveReducer {
    const hasElecApproved: ApproveReducer = {
      approved: this.activity.reviews.elec === APPROVED,
      teams: [elec],
    };
    const hasMatosApproved: ApproveReducer = {
      approved: this.activity.reviews.matos === APPROVED,
      teams: [matos],
    };
    const hasBarrierersApproved: ApproveReducer = {
      approved: this.activity.reviews.barrieres === APPROVED,
      teams: [barrieres],
    };
    const reviews = [hasBarrierersApproved, hasElecApproved, hasMatosApproved];
    switch (owner) {
      case undefined:
        return reviews.reduce(
          (acc, approval) => {
            return {
              approved: acc.approved || approval.approved,
              teams: approval.approved
                ? [...acc.teams, ...approval.teams]
                : acc.teams,
            };
          },
          { approved: false, teams: [] },
        );
      case matos:
        return hasMatosApproved;
      case elec:
        return hasElecApproved;
      case barrieres:
        return hasBarrierersApproved;
    }
  }

  removeInquiryTimeWindow(id: string): InReview {
    this.checkIfInquiryAlreadyValidatedBy();
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
    this.checkIfInquiryAlreadyValidatedBy(request.owner);
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

  assignInquiryToDrive(link: LinkInquiryDrive): InReview {
    const inquiry = Inquiries.build(this.activity.inquiry).assignDrive(
      link,
    ).inquiry;

    return { ...this.activity, inquiry };
  }
}
