import { FestivalTask } from "../festival-task";
import { FestivalTaskBuilder } from "../festival-task.builder";
import { FestivalTasksForView } from "./view";
import { Preview } from "../festival-task";

export class InMemoryFestivalTasks implements FestivalTasksForView {
  constructor(private readonly tasks: FestivalTask[]) {}

  one(ftId: number): Promise<FestivalTask | null> {
    return Promise.resolve(this.tasks.find(({ id }) => id === ftId) ?? null);
  }

  all(): Promise<Preview[]> {
    return Promise.resolve(
      this.tasks.map((task) => FestivalTaskBuilder.build(task).preview),
    );
  }
}
