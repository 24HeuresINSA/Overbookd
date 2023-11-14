import { Contractors, Prepare, TimeWindows } from "./prepare-festival-activity";
import { IProvidePeriod } from "@overbookd/period";
import {
  Contractor,
  ElectricitySupply,
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
  PrepareSecurityUpdate,
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

  updateInCharge(inCharge: PrepareInChargeUpdate): InReview {
    throw new Error("Method not implemented." + inCharge);
  }

  addContractor(contractor: PrepareContractorCreation): InReview {
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).add(contractor).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  updateContractor(contractor: PrepareContractorUpdate): InReview {
    throw new Error("Method not implemented." + contractor);
  }

  removeContractor(id: Contractor["id"]): InReview {
    throw new Error("Method not implemented." + id);
  }

  updateSigna(signa: PrepareSignaUpdate): InReview {
    throw new Error("Method not implemented." + signa);
  }

  addSignage(signage: PrepareSignageCreation): InReview {
    throw new Error("Method not implemented." + signage);
  }

  updateSignage(signage: PrepareSignageUpdate): InReview {
    throw new Error("Method not implemented." + signage);
  }

  removeSignage(id: Signage["id"]): InReview {
    throw new Error("Method not implemented." + id);
  }

  updateSecurity(security: PrepareSecurityUpdate): InReview {
    throw new Error("Method not implemented." + security);
  }

  updateSupply(supply: PrepareSupplyUpdate): InReview {
    throw new Error("Method not implemented." + supply);
  }

  addElectricitySupply(
    electricitySupply: PrepareElectricitySupplyCreation,
  ): InReview {
    throw new Error("Method not implemented." + electricitySupply);
  }

  updateElectricitySupply(
    electricitySupply: PrepareElectricitySupplyUpdate,
  ): InReview {
    throw new Error("Method not implemented." + electricitySupply);
  }

  removeElectricitySupply(id: ElectricitySupply["id"]): InReview {
    throw new Error("Method not implemented." + id);
  }

  addInquiryTimeWindow(period: IProvidePeriod): InReview {
    throw new Error("Method not implemented." + period);
  }

  removeInquiryTimeWindow(id: string): InReview {
    throw new Error("Method not implemented." + id);
  }

  addInquiry(inquiry: PrepareInquiryRequestCreation): InReview {
    throw new Error("Method not implemented." + inquiry);
  }

  removeInquiry(slug: InquiryRequest["slug"]): InReview {
    throw new Error("Method not implemented." + slug);
  }
}
