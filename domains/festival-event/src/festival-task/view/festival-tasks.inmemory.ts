import { FestivalTaskBuilder } from "../festival-task.builder.js";
import { FestivalTasksForView } from "./view.js";
import { Preview } from "../festival-task.js";
import { WithoutConflicts } from "../volunteer-conflicts.js";

export class InMemoryFestivalTasks implements FestivalTasksForView {
  constructor(private readonly tasks: WithoutConflicts[]) {}

  one(ftId: number): Promise<WithoutConflicts | null> {
    return Promise.resolve(this.tasks.find(({ id }) => id === ftId) ?? null);
  }

  all(): Promise<Preview[]> {
    return Promise.resolve(
      this.tasks.map((task) => FestivalTaskBuilder.build(task).preview),
    );
  }

  byAdherentId(adherentId: number): Promise<Preview[]> {
    return Promise.resolve(
      this.tasks
        .filter((task) => task.general.administrator.id === adherentId)
        .map((task) => FestivalTaskBuilder.build(task).preview),
    );
  }
}
