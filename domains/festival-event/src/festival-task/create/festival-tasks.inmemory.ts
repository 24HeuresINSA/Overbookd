import { Draft } from "../festival-task";
import { FestivalTasksForCreate } from "./create";

export class InMemoryFestivalTasks implements FestivalTasksForCreate {
  constructor(private festivalTasks: Draft[] = []) {}

  add(festivalTask: Draft): Promise<Draft> {
    this.festivalTasks = [...this.festivalTasks, festivalTask];
    return Promise.resolve(festivalTask);
  }

  get all(): Draft[] {
    return this.festivalTasks;
  }
}
