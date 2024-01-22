import { FestivalTask } from "./festival-task";
import { Preview } from "./festival-task";

export class FestivalTaskBuilder {
  private constructor(private readonly task: FestivalTask) {}
  static build(task: FestivalTask) {
    return new FestivalTaskBuilder(task);
  }

  get overview(): FestivalTask {
    return this.task;
  }

  get preview(): Preview {
    const { id, status, general } = this.task;
    const { name, administrator, team } = general;
    return { id, status, name, administrator, team };
  }
}
