import { Draft } from "./festival-task";
import { FestivalTasks } from "./create";

export class InMemoryFestivalTasks implements FestivalTasks {
  constructor(private festivalTasks: Draft[] = []) {}

  add(festivalTask: Draft): Promise<Draft> {
    this.festivalTasks = [...this.festivalTasks, festivalTask];
    return Promise.resolve(festivalTask);
  }

  get all(): Draft[] {
    return this.festivalTasks;
  }
}
