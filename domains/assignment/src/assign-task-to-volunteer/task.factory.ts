import { numberGenerator } from "@overbookd/list";
import { Assignment, FullTask } from "./assign-task-to-volunteer";
import { Category } from "@overbookd/festival-event-constants";

class TaskFactory {
  constructor(private readonly idGenerator: Generator<number>) {}

  init(name: string): TaskBuilder {
    const id = this.idGenerator.next().value;
    const task = defaultTask(id, name);
    return new TaskBuilder(task);
  }
}

class TaskBuilder {
  constructor(private task: FullTask) {}

  withCategory(category: Category): TaskBuilder {
    this.task = { ...this.task, category };
    return this;
  }

  withTopPriority(): TaskBuilder {
    this.task = { ...this.task, topPriority: true };
    return this;
  }

  withAssignments(assignments: Assignment[]): TaskBuilder {
    this.task = { ...this.task, assignments };
    return this;
  }

  build(): FullTask {
    return this.task;
  }
}

function defaultTask(id: number, name: string): FullTask {
  return {
    id,
    name,
    topPriority: false,
    assignments: [],
  };
}

export function getFactory() {
  return new TaskFactory(numberGenerator(1));
}
