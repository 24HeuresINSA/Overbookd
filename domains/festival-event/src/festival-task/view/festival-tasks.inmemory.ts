import { FestivalTaskBuilder } from "../festival-task.builder";
import { FestivalTasksForView } from "./view";
import { Preview } from "../festival-task";
import { WithoutConflicts } from "../volunteer-conflicts";

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
}
