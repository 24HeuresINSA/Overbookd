import { numberGenerator } from "@overbookd/list";
import { DRAFT } from "@overbookd/festival-event-constants";
import { Adherent } from "../../common/adherent.js";
import { FestivalTaskKeyEvents } from "../festival-task.event.js";
import { FestivalActivity } from "../festival-task.js";
import {
  DraftWithConflicts,
  DraftWithoutConflicts,
  FestivalTaskTranslator,
} from "../volunteer-conflicts.js";
import { isDraft } from "../../festival-event.js";
import { FestivalTaskError } from "../festival-task.error.js";

const FT_420 = 420;

type FestivalTaskCreation = {
  name: string;
  festivalActivity: FestivalActivity;
  author: Adherent;
};

export type FestivalTasksForCreate = {
  add(festivalTask: DraftWithoutConflicts): Promise<DraftWithoutConflicts>;
};

export class CreateFestivalTask {
  private idGenerator: Generator<number>;

  constructor(
    private readonly festivalTasks: FestivalTasksForCreate,
    private readonly festivalTaskTranslator: FestivalTaskTranslator,
    startId: number = 1,
  ) {
    this.idGenerator = numberGenerator(startId, [FT_420]);
  }

  async apply({
    name,
    author,
    festivalActivity,
  }: FestivalTaskCreation): Promise<DraftWithConflicts> {
    const festivalTask: DraftWithoutConflicts = {
      id: this.generateId(),
      status: DRAFT,
      festivalActivity,
      general: {
        name,
        administrator: author,
        team: null,
      },
      instructions: {
        appointment: null,
        global: null,
        inCharge: {
          volunteers: [],
          instruction: null,
        },
        contacts: [],
      },
      history: [FestivalTaskKeyEvents.created(author)],
      feedbacks: [],
      mobilizations: [],
      inquiries: [],
    };

    const created = await this.festivalTasks.add(festivalTask);
    const withConflicts = await this.festivalTaskTranslator.translate(created);
    if (!isDraft(withConflicts)) {
      throw new FestivalTaskError("Impossible de créer en BROUILLON");
    }

    return withConflicts;
  }

  private generateId(): number {
    return this.idGenerator.next().value;
  }
}
