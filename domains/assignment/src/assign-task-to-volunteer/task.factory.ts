import { numberGenerator } from "@overbookd/list";
import { Task } from "./assign-task-to-volunteer";
import { Category } from "@overbookd/festival-event-constants";
import { AssignmentBuilder } from "./assignment.builder";

class TaskFactory {
  constructor(private readonly idGenerator: Generator<number>) {}

  init(name: string): TaskBuilder {
    const id = this.idGenerator.next().value;
    const task = {
      id,
      name,
      topPriority: false,
      assignments: [],
    };
    return TaskBuilder.init(task);
  }
}

type TaskWithoutAssignments = Omit<Task, "assignments">;

class TaskBuilder {
  private constructor(
    readonly task: TaskWithoutAssignments,
    readonly assignments: AssignmentBuilder[],
  ) {}

  static init(task: TaskWithoutAssignments): TaskBuilder {
    return new TaskBuilder(task, []);
  }

  withCategory(category: Category): TaskBuilder {
    return new TaskBuilder({ ...this.task, category }, this.assignments);
  }

  withTopPriority(): TaskBuilder {
    return new TaskBuilder(
      { ...this.task, topPriority: true },
      this.assignments,
    );
  }

  withAssignments(assignments: AssignmentBuilder[]): TaskBuilder {
    return new TaskBuilder(this.task, assignments);
  }

  get value(): Task {
    return {
      ...this.task,
      assignments: this.assignments.map(({ assignment }) => assignment),
    };
  }
}

export function getTaskFactory() {
  return new TaskFactory(numberGenerator(1));
}
