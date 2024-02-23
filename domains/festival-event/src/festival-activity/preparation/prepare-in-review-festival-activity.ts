import { InitInquiry, Prepare } from "./prepare-festival-activity";
import { ElectricitySupplies } from "./section-aggregates/electricity-supplies";
import { Contractors } from "./section-aggregates/contractors";
import { TimeWindows } from "./section-aggregates/time-windows";
import { IProvidePeriod } from "@overbookd/period";
import { FestivalActivity, Reviewable } from "../festival-activity";
import { IN_REVIEW, REFUSED, VALIDATED } from "../../common/status";
import { isValidatedReviews } from "../sections/reviews";
import { Reviews } from "../../common/review";
import { isRefusedReviews } from "../../common/review";
import { Reviewer } from "../../common/review";
import {
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
  barrieres,
  communication,
  elec,
  humain,
  matos,
  secu,
  signa,
} from "../../common/review";
import { APPROVED } from "../../common/action";
import { BARRIERES, ELEC, InquiryOwner, MATOS } from "../sections/inquiry";
import { InquiryRequest } from "../../common/inquiry-request";
import { ElectricitySupply } from "../sections/supply";
import { Signage } from "../sections/signa";
import { Contractor } from "../sections/in-charge";
import { TimeWindow } from "../../common/time-window";
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
  LinkSignageCatalogItem,
  PrepareSecurityUpdate,
} from "./prepare-festival-activity.model";
import {
  FestivalActivityError,
  FreePassMustBePositive,
} from "../festival-activity.error";
import { hasAtLeastOneItem } from "@overbookd/list";
import {
  AlreadyInitialized,
  CantRemoveLastRequest,
  CantRemoveLastTimeWindow,
  Inquiries,
  NotYetInitialized,
} from "./section-aggregates/inquiries";
import { LocationIsRequired, Signages } from "./section-aggregates/signages";
import { isPrivate } from "../sections/general";

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
  constructor(reviewers: Reviewer<"FA">[]) {
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

type GeneralReviewer = typeof humain | typeof communication;

class General {
  private constructor(private readonly general: Reviewable["general"]) {}

  static init(general: Reviewable["general"]): General {
    return new General(general);
  }

  isAlreadyValidatedBy(
    reviewer: GeneralReviewer,
    reviews: Reviews<"FA">,
  ): boolean {
    switch (reviewer) {
      case communication:
        return reviews.communication === APPROVED;
      case humain:
        return reviews.humain === APPROVED;
    }
  }

  update(form: PrepareGeneralUpdate): Reviewable["general"] {
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
      !hasAtLeastOneItem(categories) ||
      !this.hasSetPhotoLink(photoLink) ||
      !hasAtLeastOneItem(timeWindows)
    ) {
      const missingPublicParts = [
        {
          verify: hasAtLeastOneItem(categories),
          message: "Il faut au moins une catégorie.",
        },
        {
          verify: this.hasSetPhotoLink(photoLink),
          message: "Il faut définir un lien pour la photo.",
        },
        {
          verify: hasAtLeastOneItem,
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
}

type ApproveReducer = {
  approved: boolean;
  teams: InquiryOwner[];
};

export class PrepareInReviewFestivalActivity implements Prepare<Reviewable> {
  private constructor(private readonly activity: Reviewable) {}

  static build(activity: Reviewable): PrepareInReviewFestivalActivity {
    return new PrepareInReviewFestivalActivity(activity);
  }

  updateGeneral(form: PrepareGeneralUpdate): Reviewable {
    this.checkIfGeneralAlreadyApproved();
    const general = General.init(this.activity.general).update(form);
    const isSwitchingPrivacy =
      this.activity.general.toPublish !== general.toPublish;

    if (!isSwitchingPrivacy) return { ...this.activity, general };

    const reviews: Reviewable["reviews"] = {
      ...this.activity.reviews,
      communication: general.toPublish ? REVIEWING : NOT_ASKING_TO_REVIEW,
    };

    if (isValidatedReviews(reviews)) {
      return { ...this.activity, general, reviews, status: VALIDATED };
    }
    if (isRefusedReviews(reviews)) {
      return { ...this.activity, general, reviews, status: REFUSED };
    }

    return { ...this.activity, general, reviews, status: IN_REVIEW };
  }

  addGeneralTimeWindow(period: IProvidePeriod): Reviewable {
    this.checkIfGeneralAlreadyApproved(humain);
    const timeWindows = TimeWindows.build(
      this.activity.general.timeWindows,
    ).add(period).entries;

    const general = { ...this.activity.general, timeWindows };
    return { ...this.activity, general };
  }

  private checkIfGeneralAlreadyApproved(askingReviewer?: GeneralReviewer) {
    const { reviews, general: generalData } = this.activity;
    const defaultReviewer = generalData.toPublish ? communication : humain;
    const reviewer = askingReviewer ?? defaultReviewer;
    const general = General.init(generalData);

    if (general.isAlreadyValidatedBy(reviewer, reviews)) {
      throw new AlreadyApprovedBy([reviewer]);
    }
  }

  removeGeneralTimeWindow(id: TimeWindow["id"]): Reviewable {
    this.checkIfGeneralAlreadyApproved(humain);

    const currentGeneral = this.activity.general;
    const timeWindowsAggregate = TimeWindows.build(currentGeneral.timeWindows);
    const timeWindows = timeWindowsAggregate.remove(id).entries;

    if (isPrivate(currentGeneral)) {
      const general = { ...currentGeneral, timeWindows };
      return { ...this.activity, general };
    }

    if (!hasAtLeastOneItem(timeWindows)) throw new NeedAtLeastOneTimeWindow();

    const general = { ...currentGeneral, timeWindows };
    return { ...this.activity, general };
  }

  updateInCharge(form: PrepareInChargeUpdate): Reviewable {
    this.checkIfInChargeAlreadyApproved();
    const adherent = form.adherent ?? this.activity.inCharge.adherent;
    const team = form.team ?? this.activity.inCharge.team;

    const inCharge = { ...this.activity.inCharge, adherent, team };
    return { ...this.activity, inCharge };
  }

  private checkIfInChargeAlreadyApproved() {
    const isValidated = this.activity.reviews.humain === APPROVED;
    if (isValidated) {
      throw new AlreadyApprovedBy([humain]);
    }
  }

  addContractor(contractor: PrepareContractorCreation): Reviewable {
    this.checkIfInChargeAlreadyApproved();
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).add(contractor).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  updateContractor(contractor: PrepareContractorUpdate): Reviewable {
    this.checkIfInChargeAlreadyApproved();
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).update(contractor).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  removeContractor(id: Contractor["id"]): Reviewable {
    this.checkIfInChargeAlreadyApproved();
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).remove(id).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  updateSigna({ location }: PrepareSignaUpdate): Reviewable {
    this.checkIfSignaAlreadyApproved();
    if (location === null) throw new LocationIsRequired();
    const signa = { ...this.activity.signa, location };
    return { ...this.activity, signa };
  }

  private checkIfSignaAlreadyApproved() {
    const isValidated = this.activity.reviews.signa === APPROVED;
    if (isValidated) {
      throw new AlreadyApprovedBy([signa]);
    }
  }

  addSignage(signage: PrepareSignageCreation): Reviewable {
    this.checkIfSignaAlreadyApproved();
    const signages = Signages.build(this.activity.signa.signages).add(
      signage,
    ).entries;
    const signa = { ...this.activity.signa, signages };
    return { ...this.activity, signa };
  }

  updateSignage(signage: PrepareSignageUpdate): Reviewable {
    this.checkIfSignaAlreadyApproved();
    const signages = Signages.build(this.activity.signa.signages).update(
      signage,
    ).entries;
    const signa = { ...this.activity.signa, signages };
    return { ...this.activity, signa };
  }

  removeSignage(id: Signage["id"]): Reviewable {
    this.checkIfSignaAlreadyApproved();
    const signages = Signages.build(this.activity.signa.signages).remove(
      id,
    ).entries;
    const signa = { ...this.activity.signa, signages };
    return { ...this.activity, signa };
  }

  linkSignageToCatalogItem(link: LinkSignageCatalogItem): Reviewable {
    const signages = Signages.build(
      this.activity.signa.signages,
    ).linkCatalogItem(link).entries;

    const signa = { ...this.activity.signa, signages };
    return { ...this.activity, signa };
  }

  updateSecurity(form: PrepareSecurityUpdate): Reviewable {
    this.checkIfSecurityAlreadyApproved();
    const specialNeed =
      form.specialNeed === undefined
        ? this.activity.security.specialNeed
        : form.specialNeed;
    const freePass = form.freePass ?? this.activity.security.freePass;

    if (freePass < 0) throw new FreePassMustBePositive();

    const security = { ...this.activity.inCharge, specialNeed, freePass };
    return { ...this.activity, security };
  }

  private checkIfSecurityAlreadyApproved() {
    const isValidated = this.activity.reviews.secu === APPROVED;
    if (isValidated) {
      throw new AlreadyApprovedBy([secu]);
    }
  }

  updateSupply(form: PrepareSupplyUpdate): Reviewable {
    this.checkIfSupplyAlreadyApproved();
    const supply = { ...this.activity.supply, ...form };
    return { ...this.activity, supply };
  }

  private checkIfSupplyAlreadyApproved() {
    const isValidated = this.activity.reviews.elec === APPROVED;
    if (isValidated) {
      throw new AlreadyApprovedBy([elec]);
    }
  }

  addElectricitySupply(
    electricitySupply: PrepareElectricitySupplyCreation,
  ): Reviewable {
    this.checkIfSupplyAlreadyApproved();
    const electricity = ElectricitySupplies.build(
      this.activity.supply.electricity,
    ).add(electricitySupply).entries;

    const supply = { ...this.activity.supply, electricity };
    return { ...this.activity, supply };
  }

  updateElectricitySupply(
    electricitySupply: PrepareElectricitySupplyUpdate,
  ): Reviewable {
    this.checkIfSupplyAlreadyApproved();
    const electricity = ElectricitySupplies.build(
      this.activity.supply.electricity,
    ).update(electricitySupply).entries;

    const supply = { ...this.activity.supply, electricity };
    return { ...this.activity, supply };
  }

  removeElectricitySupply(id: ElectricitySupply["id"]): Reviewable {
    this.checkIfSupplyAlreadyApproved();
    const electricity = ElectricitySupplies.build(
      this.activity.supply.electricity,
    ).remove(id).entries;

    const supply = { ...this.activity.supply, electricity };
    return { ...this.activity, supply };
  }

  initInquiry({ request, timeWindow }: InitInquiry): Reviewable {
    if (Inquiries.alreadyInitialized(this.activity.inquiry)) {
      throw new AlreadyInitialized();
    }
    this.checkIfInquiryAlreadyApprovedBy(request.owner);

    const inquiry = Inquiries.init()
      .addRequest(request)
      .addTimeWindow(timeWindow).inquiry;

    return { ...this.activity, inquiry };
  }

  clearInquiry(): Reviewable {
    this.checkIfHasImpactOnApprovedRequests();
    const inquiry = Inquiries.init().inquiry;
    return { ...this.activity, inquiry };
  }

  addInquiryTimeWindow(period: IProvidePeriod): Reviewable {
    this.checkIfHasImpactOnApprovedRequests();
    this.checkIfAlreadyInitialized();

    const inquiry = Inquiries.build(this.activity.inquiry).addTimeWindow(
      period,
    ).inquiry;

    return { ...this.activity, inquiry };
  }

  private checkIfHasImpactOnApprovedRequests() {
    type ListAndOwner = [InquiryRequest[], InquiryOwner];

    const elec: ListAndOwner = [this.activity.inquiry.electricity, ELEC];
    const gear: ListAndOwner = [this.activity.inquiry.gears, MATOS];
    const barrier: ListAndOwner = [this.activity.inquiry.barriers, BARRIERES];

    const hasImpact = [elec, gear, barrier].some(([request, owner]) => {
      const hasRequest = request.length > 0;
      const { approved } = this.isInquiryApprovedBy(owner);
      return hasRequest && approved;
    });

    const allApproved =
      this.activity.reviews.barrieres === APPROVED &&
      this.activity.reviews.elec === APPROVED &&
      this.activity.reviews.matos === APPROVED;

    if (hasImpact || allApproved) {
      return this.checkIfInquiryAlreadyApprovedBy();
    }
  }

  private checkIfInquiryAlreadyApprovedBy(owner?: InquiryOwner) {
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

  removeInquiryTimeWindow(id: string): Reviewable {
    this.checkIfHasImpactOnApprovedRequests();
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

  addInquiry(request: PrepareInquiryRequestCreation): Reviewable {
    this.checkIfInquiryAlreadyApprovedBy(request.owner);
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

  removeInquiry(slug: InquiryRequest["slug"]): Reviewable {
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

  assignInquiryToDrive(link: LinkInquiryDrive): Reviewable {
    const inquiry = Inquiries.build(this.activity.inquiry).assignDrive(
      link,
    ).inquiry;

    return { ...this.activity, inquiry };
  }
}
