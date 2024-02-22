import { numberGenerator } from "@overbookd/list";
import { DRAFT, IN_REVIEW, REFUSED, VALIDATED } from "../common/status";
import { isKeyOf } from "../is-key-of";
import {
  Draft,
  FestivalActivity,
  FestivalTask,
  InReview,
  Refused,
  Reviewable,
} from "./festival-task";
import { FestivalTaskKeyEvents } from "./festival-task.event";
import {
  defaultReviewableMobilization,
  deuxTables,
  friday10hfriday19h,
  friday11hfriday18h,
  humaGrass,
  lea,
  noel,
  noelContact,
} from "./festival-task.test-util";
import { NOT_ASKING_TO_REVIEW, REVIEWING } from "../common/review";
import { WithConflicts } from "./volunteer-conflicts";
import { isDraft } from "../festival-event";
import { REJECTED } from "../common/action";

type FestivalTaskSection =
  | WithConflicts["general"]
  | WithConflicts["festivalActivity"]
  | Reviewable["reviews"]
  | WithConflicts["instructions"];

type DraftWithConflicts = Extract<WithConflicts, Draft>;
type InReviewWithConflicts = Extract<WithConflicts, InReview>;
type RefusedWithConflicts = Extract<WithConflicts, Refused>;
type ReviewableWithConflicts = Extract<WithConflicts, Reviewable>;

class FestivalTaskFactory {
  constructor(private readonly idGenerator: Generator<number>) {}

  draft(name: string): FestivalTaskBuilder<DraftWithConflicts> {
    const id = this.idGenerator.next().value;
    const task = defaultDraft(id, name);
    return FestivalTaskBuilder.init(task);
  }

  inReview(name: string): FestivalTaskBuilder<InReviewWithConflicts> {
    const id = this.idGenerator.next().value;
    const task = defaultInReview(id, name);
    return FestivalTaskBuilder.init(task);
  }

  refused(name: string): FestivalTaskBuilder<RefusedWithConflicts> {
    const id = this.idGenerator.next().value;
    const task = defaultRefused(id, name);
    return FestivalTaskBuilder.init(task);
  }
}

class FestivalTaskBuilder<T extends WithConflicts> {
  private constructor(private festivalTask: T) {}

  static init<T extends WithConflicts>(festivalTask: T) {
    return new FestivalTaskBuilder<T>(festivalTask);
  }

  withGeneral(general: Partial<T["general"]>) {
    const festivalTask = {
      ...this.festivalTask,
      general: this.merge(this.festivalTask.general, general),
    };
    return new FestivalTaskBuilder(festivalTask);
  }

  withFestivalActivity(override: Partial<T["festivalActivity"]>) {
    const festivalActivity = this.merge(
      this.festivalTask.festivalActivity,
      override,
    );
    const festivalTask = { ...this.festivalTask, festivalActivity };

    if (isDraft<WithConflicts>(festivalTask)) {
      return new FestivalTaskBuilder<T>(festivalTask);
    }

    const reviews = this.buildReviews(festivalActivity, festivalTask);
    return new FestivalTaskBuilder<T>({ ...festivalTask, reviews });
  }

  private buildReviews(
    festivalActivity: FestivalActivity,
    festivalTask: ReviewableWithConflicts,
  ) {
    const elecIsNotAskingToReview = !festivalActivity.hasSupplyRequest;
    const elecHasAlreadyStatus =
      festivalTask.reviews.elec !== NOT_ASKING_TO_REVIEW;

    if (elecIsNotAskingToReview) {
      return { ...festivalTask.reviews, elec: NOT_ASKING_TO_REVIEW };
    }

    if (elecHasAlreadyStatus) return festivalTask.reviews;

    return { ...festivalTask.reviews, elec: IN_REVIEW };
  }

  withReviews<
    Reviews = T extends ReviewableWithConflicts ? Partial<T["reviews"]> : null,
  >(reviews: Reviews) {
    if (isDraft<FestivalTask>(this.festivalTask) || !reviews) return this;

    const festivalTask = {
      ...this.festivalTask,
      reviews: this.merge(this.festivalTask.reviews, reviews),
    } as const;
    return new FestivalTaskBuilder<T>(festivalTask);
  }

  withInstructions(instructions: Partial<T["instructions"]>) {
    const festivalTask = {
      ...this.festivalTask,
      instructions: this.merge(this.festivalTask.instructions, instructions),
    };
    return new FestivalTaskBuilder(festivalTask);
  }

  withInquiries(inquiries: T["inquiries"]) {
    const festivalTask = {
      ...this.festivalTask,
      inquiries,
    };

    return new FestivalTaskBuilder(festivalTask);
  }

  withMobilizations(mobilizations: T["mobilizations"]) {
    const festivalTask = {
      ...this.festivalTask,
      mobilizations,
    };
    return new FestivalTaskBuilder(festivalTask);
  }

  build(): T {
    return this.festivalTask;
  }

  private merge<T extends FestivalTaskSection>(
    current: T,
    update: Partial<T>,
  ): T {
    return Object.keys(current).reduce<T>((acc: T, key: string) => {
      if (!isKeyOf(current, key)) return acc;

      // eslint-disable-next-line security/detect-object-injection
      const updated = update[key];
      if (updated === undefined) return acc;

      return { ...acc, [key]: updated };
    }, current);
  }
}

function defaultDraft(id: number, name: string): DraftWithConflicts {
  return {
    id,
    status: DRAFT,
    general: {
      name,
      administrator: noel,
      team: null,
    },
    festivalActivity: defaultActivity(name),
    instructions: {
      appointment: null,
      contacts: [],
      global: null,
      inCharge: {
        instruction: null,
        volunteers: [],
      },
    },
    history: [FestivalTaskKeyEvents.created(noel)],
    feedbacks: [],
    inquiries: [],
    mobilizations: [],
  };
}

function defaultInReview(id: number, name: string): InReviewWithConflicts {
  return {
    id,
    status: IN_REVIEW,
    general: {
      name,
      administrator: noel,
      team: "plaizir",
    },
    festivalActivity: defaultActivity(name),
    instructions: {
      appointment: humaGrass,
      contacts: [noelContact],
      global: "Des instructions globales",
      inCharge: {
        instruction: null,
        volunteers: [],
      },
    },
    history: [
      FestivalTaskKeyEvents.created(noel),
      FestivalTaskKeyEvents.readyToReview(noel),
    ],
    feedbacks: [],
    inquiries: [],
    mobilizations: [defaultReviewableMobilization],
    reviews: {
      humain: REVIEWING,
      matos: REVIEWING,
      elec: NOT_ASKING_TO_REVIEW,
    },
    reviewer: lea,
  };
}

function defaultActivity(name: string): FestivalActivity {
  return {
    id: 1,
    name: `${name} activity`,
    status: VALIDATED,
    location: humaGrass,
    hasSupplyRequest: false,
    inquiry: {
      timeWindows: [friday10hfriday19h],
      all: [deuxTables],
    },
    timeWindows: [friday11hfriday18h],
  };
}

function defaultRefused(id: number, name: string): RefusedWithConflicts {
  return {
    id,
    status: REFUSED,
    general: {
      name,
      administrator: noel,
      team: "plaizir",
    },
    festivalActivity: defaultActivity(name),
    instructions: {
      appointment: humaGrass,
      contacts: [noelContact],
      global: "Des instructions globales",
      inCharge: {
        instruction: null,
        volunteers: [],
      },
    },
    history: [
      FestivalTaskKeyEvents.created(noel),
      FestivalTaskKeyEvents.readyToReview(noel),
    ],
    feedbacks: [],
    inquiries: [],
    mobilizations: [defaultReviewableMobilization],
    reviews: {
      humain: REJECTED,
      matos: REVIEWING,
      elec: NOT_ASKING_TO_REVIEW,
    },
    reviewer: lea,
  };
}

export function getFactory() {
  return new FestivalTaskFactory(numberGenerator(1));
}
