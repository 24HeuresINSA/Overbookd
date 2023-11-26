import {
  DRAFT,
  Draft,
  FestivalActivity,
  IN_REVIEW,
  InReview,
  NOT_ASKING_TO_REVIEW,
  Public,
  REVIEWING,
  isDraft,
} from "./festival-activity";
import {
  saturday11hToSaturday18h,
  friday18hToMonday00h,
  lea,
} from "./festival-activity.fake";

type FestivalActivitySections =
  | FestivalActivity["general"]
  | FestivalActivity["inCharge"]
  | FestivalActivity["signa"]
  | FestivalActivity["security"]
  | FestivalActivity["supply"]
  | FestivalActivity["inquiry"];

type PublicData = Partial<
  Pick<Public, "isFlagship" | "photoLink" | "categories" | "timeWindows">
>;

function* numberGenerator(start: number): Generator<number> {
  for (let i = start; i < 1000000; i++) {
    yield i;
  }
}

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

  asPublic(publicData: PublicData): FestivalActivityBuilder<T> {
    const general: Partial<Public> = {
      isFlagship: publicData.isFlagship ?? false,
      toPublish: true,
      categories: publicData.categories ?? ["public"],
      timeWindows: publicData.timeWindows ?? [saturday11hToSaturday18h],
      photoLink:
        publicData.photoLink ??
        `https://instagram.com/${this.festivalActivity.id}`,
    };

    const reviews = isDraft(this.festivalActivity)
      ? undefined
      : { ...this.festivalActivity.reviews, comcom: REVIEWING };

    this.festivalActivity = {
      ...this.festivalActivity,
      general: this.merge(this.festivalActivity.general, general),
      reviews,
    };

    return this;
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

  private merge<T extends FestivalActivitySections>(
    current: T,
    update: Partial<T>,
  ): T {
    return Object.keys(current).reduce<T>((acc: T, key: string) => {
      if (!isKeyOf(current, key)) return acc;

      // eslint-disable-next-line security/detect-object-injection
      acc[key] = update[key] ?? current[key];
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
      location: "Rien a declarer",
      signages: [],
    },
    security: {
      specialNeed: null,
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
      comcom: NOT_ASKING_TO_REVIEW,
    },
  };
}

function defaultDraft(id: number, name: string): Draft {
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
  };
}

export function getFactory() {
  return new FestivalActivityFactory(numberGenerator(1));
}
