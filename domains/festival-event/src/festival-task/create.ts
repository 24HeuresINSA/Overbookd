import { numberGenerator } from "@overbookd/list";
import { DRAFT } from "../common/status";
import { Adherent } from "../common/adherent";
import { FestivalTaskKeyEvents } from "./festival-task.event";
import { FestivalActivity, Draft } from "./festival-task";

type FestivalTaskCreation = {
  name: string;
  festivalActivity: FestivalActivity;
  author: Adherent;
};
const FT_420 = 420;
export type FestivalTasks = {
  add(festivalTask: Draft): Promise<Draft>;
};
export class CreateFestivalTask {
  private idGenerator: Generator<number>;

  constructor(
    private readonly festivalTasks: FestivalTasks,
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
          adherents: [],
          instruction: null,
        },
        contacts: [],
      },
      history: [FestivalTaskKeyEvents.created(author)],
      feedbacks: [],
      volunteerInquiries: [],
      gearInquiries: [],
    };

    return this.festivalTasks.add(festivalTask);
  }

  private generateId(): number {
    return this.idGenerator.next().value;
  }
}
