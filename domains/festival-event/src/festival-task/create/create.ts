import { numberGenerator } from "@overbookd/list";
import { DRAFT } from "../../common/status";
import { Adherent } from "../../common/adherent";
import { FestivalTaskKeyEvents } from "../festival-task.event";
import { FestivalActivity, Draft, isDraft } from "../festival-task";
import { FestivalTaskTranslator, WithConflicts } from "../volunteer-conflicts";

const FT_420 = 420;

type FestivalTaskCreation = {
  name: string;
  festivalActivity: FestivalActivity;
  author: Adherent;
};

type DraftWithoutConflicts = Exclude<Draft, WithConflicts>;

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
  }: FestivalTaskCreation): Promise<Draft> {
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
    if (!isDraft(withConflicts)) throw new Error("");

    return withConflicts;
  }

  private generateId(): number {
    return this.idGenerator.next().value;
  }
}
