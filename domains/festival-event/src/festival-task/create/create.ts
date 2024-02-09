import { numberGenerator } from "@overbookd/list";
import { DRAFT } from "../../common/status";
import { Adherent } from "../../common/adherent";
import { FestivalTaskKeyEvents } from "../festival-task.event";
import {
  FestivalActivity,
  Draft,
  Mobilization,
  Volunteer,
} from "../festival-task";
import { FestivalTaskTranslator } from "../volunteer-conflicts";

const FT_420 = 420;

type FestivalTaskCreation = {
  name: string;
  festivalActivity: FestivalActivity;
  author: Adherent;
};

export type FestivalTasksForCreate = {
  add(
    festivalTask: Draft<Mobilization<Volunteer>>,
  ): Promise<Draft<Mobilization<Volunteer>>>;
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
    const festivalTask: Draft = {
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
    return this.festivalTaskTranslator.translate(created);
  }

  private generateId(): number {
    return this.idGenerator.next().value;
  }
}
