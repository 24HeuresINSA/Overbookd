import { numberGenerator } from "@overbookd/list";
import {
  Draft,
  FestivalActivity,
  InReview,
  Refused,
  Reviewable,
  Validated,
  isDraft,
} from "./festival-activity";
import { DRAFT, IN_REVIEW, REFUSED, VALIDATED } from "../common/status";
import { NOT_ASKING_TO_REVIEW, REVIEWING } from "../common/review";
import { APPROVED, REJECTED } from "../common/action";
import { Public } from "./sections/general";
import {
  saturday11hToSaturday18h,
  friday18hToMonday00h,
  lea,
  local24h,
  george,
  noel,
} from "./festival-activity.fake";
import { FestivalActivityKeyEvents } from "./festival-activity.event";

type FestivalActivitySections =
  | FestivalActivity["general"]
  | FestivalActivity["inCharge"]
  | FestivalActivity["signa"]
  | FestivalActivity["security"]
  | FestivalActivity["supply"]
  | FestivalActivity["inquiry"]
  | Reviewable["reviews"];

type PublicData = Partial<
  Pick<Public, "isFlagship" | "photoLink" | "categories" | "timeWindows">
>;

class FestivalActivityFactory {
  constructor(private readonly idGenerator: Generator<number>) {}

  inReview(name: string): FestivalActivityBuilder<InReview> {
    const id = this.idGenerator.next().value;
    const festivalActivity = defaultInReview(id, name);
    return new FestivalActivityBuilder(festivalActivity);
  }

  draft(name: string): FestivalActivityBuilder<Draft> {
    const id = this.idGenerator.next().value;
    const festivalActivity = defaultDraft(id, name);
    return new FestivalActivityBuilder(festivalActivity);
  }

  validated(name: string): FestivalActivityBuilder<Validated> {
    const id = this.idGenerator.next().value;
    const festivalActivity = defaultValidated(id, name);
    return new FestivalActivityBuilder(festivalActivity);
  }

  refused(name: string): FestivalActivityBuilder<Refused> {
    const id = this.idGenerator.next().value;
    const festivalActivity = defaultRefused(id, name);
    return new FestivalActivityBuilder(festivalActivity);
  }
}

class FestivalActivityBuilder<T extends FestivalActivity> {
  constructor(private festivalActivity: T) {}

  withGeneral(general: Partial<T["general"]>): FestivalActivityBuilder<T> {
    this.festivalActivity = {
      ...this.festivalActivity,
      general: this.merge(this.festivalActivity.general, general),
    };
    return this;
  }

  asPublic(publicData?: PublicData): FestivalActivityBuilder<T> {
    const general: Partial<Public> = {
      isFlagship: publicData?.isFlagship ?? false,
      toPublish: true,
      categories: publicData?.categories ?? ["public"],
      timeWindows: publicData?.timeWindows ?? [saturday11hToSaturday18h],
      photoLink:
        publicData?.photoLink ??
        `https://instagram.com/${this.festivalActivity.id}`,
    };

    this.festivalActivity = {
      ...this.festivalActivity,
      general: this.merge(this.festivalActivity.general, general),
    };

    const reviews: Partial<Reviewable["reviews"]> = isDraft(
      this.festivalActivity,
    )
      ? {}
      : { communication: REVIEWING };

    return this.withReviews(reviews);
  }

  withInCharge(inCharge: Partial<T["inCharge"]>): FestivalActivityBuilder<T> {
    this.festivalActivity = {
      ...this.festivalActivity,
      inCharge: this.merge(this.festivalActivity.inCharge, inCharge),
    };
    return this;
  }

  withSigna(signa: Partial<T["signa"]>): FestivalActivityBuilder<T> {
    this.festivalActivity = {
      ...this.festivalActivity,
      signa: this.merge(this.festivalActivity.signa, signa),
    };
    return this;
  }

  withSecurity(security: Partial<T["security"]>): FestivalActivityBuilder<T> {
    this.festivalActivity = {
      ...this.festivalActivity,
      security: this.merge(this.festivalActivity.security, security),
    };
    return this;
  }

  withSupply(supply: Partial<T["supply"]>): FestivalActivityBuilder<T> {
    this.festivalActivity = {
      ...this.festivalActivity,
      supply: this.merge(this.festivalActivity.supply, supply),
    };
    return this;
  }

  withInquiry(inquiry: Partial<T["inquiry"]>): FestivalActivityBuilder<T> {
    this.festivalActivity = {
      ...this.festivalActivity,
      inquiry: this.merge(this.festivalActivity.inquiry, inquiry),
    };
    return this;
  }

  withReviews(
    reviews: Partial<Reviewable["reviews"]>,
  ): FestivalActivityBuilder<T> {
    if (isDraft(this.festivalActivity)) return this;

    this.festivalActivity = {
      ...this.festivalActivity,
      reviews: this.merge(this.festivalActivity.reviews, reviews),
    };
    return this;
  }

  private merge<T extends FestivalActivitySections>(
    current: T,
    update: Partial<T>,
  ): T {
    return Object.keys(current).reduce<T>((acc: T, key: string) => {
      if (!isKeyOf(current, key)) return acc;

      // eslint-disable-next-line security/detect-object-injection
      const updated = update[key];
      acc[key] = updated === undefined ? current[key] : updated;
      return acc;
    }, current);
  }

  build(): T {
    return this.festivalActivity;
  }
}

function isKeyOf<T extends object>(
  object: T,
  key: string | number | symbol,
): key is keyof T {
  return Object.keys(object).includes(key.toString());
}

function defaultInReview(id: number, name: string): InReview {
  return {
    id,
    status: IN_REVIEW,
    general: {
      name,
      description: `${name} est indispensable.`,
      categories: [],
      toPublish: false,
      photoLink: null,
      isFlagship: false,
      timeWindows: [friday18hToMonday00h],
    },
    inCharge: {
      adherent: lea,
      team: "secu",
      contractors: [],
    },
    signa: {
      location: local24h,
      signages: [],
    },
    security: {
      specialNeed: null,
      freePass: 0,
    },
    supply: {
      electricity: [],
      water: null,
    },
    inquiry: {
      timeWindows: [],
      gears: [],
      electricity: [],
      barriers: [],
    },
    reviews: {
      humain: REVIEWING,
      signa: REVIEWING,
      secu: REVIEWING,
      matos: REVIEWING,
      elec: REVIEWING,
      barrieres: REVIEWING,
      communication: NOT_ASKING_TO_REVIEW,
    },
    feedbacks: [],
    history: [
      FestivalActivityKeyEvents.created(lea),
      FestivalActivityKeyEvents.readyToReview(lea),
    ],
    tasks: [],
  };
}

function defaultValidated(id: number, name: string): Validated {
  return {
    id,
    status: VALIDATED,
    general: {
      name,
      description: `${name} est indispensable.`,
      categories: [],
      toPublish: false,
      photoLink: null,
      isFlagship: false,
      timeWindows: [friday18hToMonday00h],
    },
    inCharge: {
      adherent: lea,
      team: "secu",
      contractors: [],
    },
    signa: {
      location: local24h,
      signages: [],
    },
    security: {
      specialNeed: null,
      freePass: 0,
    },
    supply: {
      electricity: [],
      water: null,
    },
    inquiry: {
      timeWindows: [],
      gears: [],
      electricity: [],
      barriers: [],
    },
    reviews: {
      humain: APPROVED,
      signa: APPROVED,
      secu: APPROVED,
      matos: APPROVED,
      elec: APPROVED,
      barrieres: APPROVED,
      communication: NOT_ASKING_TO_REVIEW,
    },
    feedbacks: [],
    history: [
      FestivalActivityKeyEvents.created(lea),
      FestivalActivityKeyEvents.readyToReview(lea),
      FestivalActivityKeyEvents.approved(george),
      FestivalActivityKeyEvents.approved(george),
      FestivalActivityKeyEvents.approved(noel),
      FestivalActivityKeyEvents.approved(noel),
      FestivalActivityKeyEvents.approved(lea),
      FestivalActivityKeyEvents.approved(lea),
    ],
    tasks: [],
  };
}

function defaultRefused(id: number, name: string): Refused {
  return {
    id,
    status: REFUSED,
    general: {
      name,
      description: `${name} est indispensable.`,
      categories: [],
      toPublish: false,
      photoLink: null,
      isFlagship: false,
      timeWindows: [friday18hToMonday00h],
    },
    inCharge: {
      adherent: lea,
      team: "secu",
      contractors: [],
    },
    signa: {
      location: local24h,
      signages: [],
    },
    security: {
      specialNeed: null,
      freePass: 0,
    },
    supply: {
      electricity: [],
      water: null,
    },
    inquiry: {
      timeWindows: [],
      gears: [],
      electricity: [],
      barriers: [],
    },
    reviews: {
      humain: REJECTED,
      signa: APPROVED,
      secu: REVIEWING,
      matos: REVIEWING,
      elec: REJECTED,
      barrieres: REVIEWING,
      communication: NOT_ASKING_TO_REVIEW,
    },
    feedbacks: [],
    history: [
      FestivalActivityKeyEvents.created(lea),
      FestivalActivityKeyEvents.readyToReview(lea),
      FestivalActivityKeyEvents.rejected(george, "Il manque des info"),
    ],
    tasks: [],
  };
}

export function defaultDraft(id: number, name: string): Draft {
  return {
    id,
    general: {
      name,
      description: null,
      categories: [],
      toPublish: false,
      photoLink: null,
      isFlagship: false,
      timeWindows: [],
    },
    status: DRAFT,
    inCharge: {
      adherent: lea,
      team: null,
      contractors: [],
    },
    signa: { location: null, signages: [] },
    security: {
      specialNeed: null,
      freePass: 0,
    },
    supply: {
      electricity: [],
      water: null,
    },
    inquiry: {
      timeWindows: [],
      gears: [],
      electricity: [],
      barriers: [],
    },
    feedbacks: [],
    history: [FestivalActivityKeyEvents.created(lea)],
    tasks: [],
  };
}

export function getFactory() {
  return new FestivalActivityFactory(numberGenerator(1));
}
