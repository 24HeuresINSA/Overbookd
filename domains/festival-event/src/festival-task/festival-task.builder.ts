import { FestivalTask } from "./festival-task";
import { Preview } from "./festival-task";

type WithoutConflicts = FestivalTask<{ withConflicts: false }>;

export class FestivalTaskBuilder {
  private constructor(private readonly task: WithoutConflicts) {}
  static build(task: WithoutConflicts) {
    return new FestivalTaskBuilder(task);
  }

  get overview(): WithoutConflicts {
    return this.task;
  }

  get preview(): Preview {
    const { id, status, general } = this.task;
    const { name, administrator, team } = general;
    return { id, status, name, administrator, team };
  }
}
