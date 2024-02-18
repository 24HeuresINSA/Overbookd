import { numberGenerator } from "@overbookd/list";
import { DRAFT, IN_REVIEW, VALIDATED } from "../common/status";
import { isKeyOf } from "../is-key-of";
import {
  Draft,
  FestivalActivity,
  FestivalTask,
  InReview,
} from "./festival-task";
import { FestivalTaskKeyEvents } from "./festival-task.event";
import {
  deuxTables,
  friday10hfriday19h,
  friday11hfriday18h,
  humaGrass,
  lea,
  noel,
  noelContact,
} from "./festival-task.test-util";
import { NOT_ASKING_TO_REVIEW, REVIEWING } from "../common/review";

type FestivalTaskSection =
  | FestivalTask["general"]
  | FestivalTask["festivalActivity"]
  | FestivalTask["instructions"];

class FestivalTaskFactory {
  constructor(private readonly idGenerator: Generator<number>) {}

  draft(name: string): FestivalTaskBuilder<Draft> {
    const id = this.idGenerator.next().value;
    const task = defaultDraft(id, name);
    return FestivalTaskBuilder.init(task);
  }

  inReview(name: string): FestivalTaskBuilder<InReview> {
    const id = this.idGenerator.next().value;
    const task = defaultInReview(id, name);
    return FestivalTaskBuilder.init(task);
  }
}

class FestivalTaskBuilder<T extends FestivalTask> {
  private constructor(private festivalTask: T) {}

  static init<T extends FestivalTask>(festivalTask: T) {
    return new FestivalTaskBuilder<T>(festivalTask);
  }

  withGeneral(general: Partial<FestivalTask["general"]>) {
    const festivalTask = {
      ...this.festivalTask,
      general: this.merge(this.festivalTask.general, general),
    };
    return new FestivalTaskBuilder(festivalTask);
  }

  withFestivalActivity(
    festivalActivity: Partial<FestivalTask["festivalActivity"]>,
  ) {
    const festivalTask = {
      ...this.festivalTask,
      festivalActivity: this.merge(
        this.festivalTask.festivalActivity,
        festivalActivity,
      ),
    };
    return new FestivalTaskBuilder(festivalTask);
  }

  withInstructions(instructions: Partial<FestivalTask["instructions"]>) {
    const festivalTask = {
      ...this.festivalTask,
      instructions: this.merge(this.festivalTask.instructions, instructions),
    };
    return new FestivalTaskBuilder(festivalTask);
  }

  withInquiries(inquiries: FestivalTask["inquiries"]) {
    const festivalTask = {
      ...this.festivalTask,
      inquiries,
    };

    return new FestivalTaskBuilder(festivalTask);
  }

  withMobilizations(mobilizations: FestivalTask["mobilizations"]) {
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

function defaultDraft(id: number, name: string): Draft {
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

function defaultInReview(id: number, name: string): InReview {
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
    history: [FestivalTaskKeyEvents.created(noel)],
    feedbacks: [],
    inquiries: [],
    mobilizations: [],
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

export function getFactory() {
  return new FestivalTaskFactory(numberGenerator(1));
}
