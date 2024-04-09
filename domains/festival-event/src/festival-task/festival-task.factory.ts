import { numberGenerator } from "@overbookd/list";
import {
  DRAFT,
  IN_REVIEW,
  READY_TO_ASSIGN,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event-constants";
import { isKeyOf } from "../is-key-of";
import {
  Draft,
  FestivalActivity,
  FestivalTask,
  InReview,
  Refused,
  Reviewable,
  Validated,
} from "./festival-task";
import { FestivalTaskKeyEvents } from "./festival-task.event";
import {
  MobilizationBuilder,
  deuxTables,
  friday10hfriday19h,
  friday11h,
  friday11hfriday18h,
  friday17h,
  george,
  humaGrass,
  lea,
  noel,
  noelContact,
} from "./festival-task.test-util";
import { NOT_ASKING_TO_REVIEW, REVIEWING } from "../common/review";
import {
  ReadyToAssignWithConflicts,
  WithConflicts,
} from "./volunteer-conflicts";
import { isDraft } from "../festival-event";
import { APPROVED, REJECTED } from "../common/action";
import { Assignments } from "./enable-assignment/enable-assignment";

type FestivalTaskSection =
  | WithConflicts["general"]
  | WithConflicts["festivalActivity"]
  | Reviewable["reviews"]
  | WithConflicts["instructions"];

type DraftWithConflicts = Extract<WithConflicts, Draft>;
export type InReviewWithConflicts = Extract<WithConflicts, InReview>;
type RefusedWithConflicts = Extract<WithConflicts, Refused>;
export type ValidatedWithConflicts = Extract<WithConflicts, Validated>;
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

  validated(name: string): FestivalTaskBuilder<ValidatedWithConflicts> {
    const id = this.idGenerator.next().value;
    const task = defaultValidated(id, name);
    return FestivalTaskBuilder.init(task);
  }

  readyToAssign(name: string): FestivalTaskBuilder<ReadyToAssignWithConflicts> {
    const id = this.idGenerator.next().value;
    const task = defaultReadyToAssign(id, name);
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
    general: defaultGeneral(name),
    festivalActivity: defaultActivity(name),
    instructions: defaultInstructions(),
    history: [
      FestivalTaskKeyEvents.created(noel),
      FestivalTaskKeyEvents.readyToReview(noel),
    ],
    feedbacks: [],
    inquiries: [],
    mobilizations: defaultMobilizations(),
    reviews: {
      humain: REVIEWING,
      matos: REVIEWING,
      elec: NOT_ASKING_TO_REVIEW,
    },
    reviewer: lea,
  };
}

function defaultRefused(id: number, name: string): RefusedWithConflicts {
  return {
    id,
    status: REFUSED,
    general: defaultGeneral(name),
    festivalActivity: defaultActivity(name),
    instructions: defaultInstructions(),
    history: [
      FestivalTaskKeyEvents.created(noel),
      FestivalTaskKeyEvents.readyToReview(noel),
      FestivalTaskKeyEvents.rejected(lea, "Trop de monde demandé"),
    ],
    feedbacks: [],
    inquiries: [],
    mobilizations: defaultMobilizations(),
    reviews: {
      humain: REJECTED,
      matos: REVIEWING,
      elec: NOT_ASKING_TO_REVIEW,
    },
    reviewer: lea,
  };
}

function defaultValidated(id: number, name: string): ValidatedWithConflicts {
  return {
    id,
    status: VALIDATED,
    general: defaultGeneral(name),
    festivalActivity: defaultActivity(name),
    instructions: defaultInstructions(),
    history: [
      FestivalTaskKeyEvents.created(noel),
      FestivalTaskKeyEvents.readyToReview(noel),
      FestivalTaskKeyEvents.approved(lea),
      FestivalTaskKeyEvents.approved(george),
    ],
    feedbacks: [],
    inquiries: [],
    mobilizations: defaultMobilizations(),
    reviews: {
      humain: APPROVED,
      matos: APPROVED,
      elec: NOT_ASKING_TO_REVIEW,
    },
    reviewer: lea,
  };
}

function defaultReadyToAssign(
  id: number,
  name: string,
): ReadyToAssignWithConflicts {
  return {
    id,
    topPriority: false,
    status: READY_TO_ASSIGN,
    general: defaultGeneral(name),
    festivalActivity: defaultActivity(name),
    instructions: defaultInstructions(),
    history: [
      FestivalTaskKeyEvents.created(noel),
      FestivalTaskKeyEvents.readyToReview(noel),
      FestivalTaskKeyEvents.approved(lea),
      FestivalTaskKeyEvents.approved(george),
      FestivalTaskKeyEvents.readyToReview(lea),
    ],
    feedbacks: [],
    inquiries: [],
    mobilizations: defaultMobilizations().map(Assignments.generate),
    reviews: {
      humain: APPROVED,
      matos: APPROVED,
      elec: NOT_ASKING_TO_REVIEW,
    },
    reviewer: lea,
  };
}

function defaultInstructions(): Reviewable["instructions"] {
  return {
    appointment: humaGrass,
    contacts: [noelContact],
    global: "Des instructions globales",
    inCharge: {
      instruction: null,
      volunteers: [],
    },
  };
}

function defaultMobilizations() {
  return [
    MobilizationBuilder.init<ReviewableWithConflicts>({
      start: friday11h,
      end: friday17h,
      teams: [{ count: 3, team: "bénévole" }],
      durationSplitInHour: 2,
    }).mobilization,
    MobilizationBuilder.init<ReviewableWithConflicts>({
      start: friday11h,
      end: friday17h,
      teams: [{ count: 1, team: "conducteur" }],
    }).mobilization,
  ];
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

function defaultGeneral(name: string): Reviewable["general"] {
  return {
    name,
    administrator: noel,
    team: "plaizir",
  };
}

export function getFactory() {
  return new FestivalTaskFactory(numberGenerator(1));
}
