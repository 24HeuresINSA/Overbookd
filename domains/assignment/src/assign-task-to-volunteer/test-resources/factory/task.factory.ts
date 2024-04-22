import { numberGenerator } from "@overbookd/list";
import { Task } from "../../task";
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
    const linkedAssignments = assignments.map((assignment) =>
      assignment.withTaskId(this.task.id),
    );
    return new TaskBuilder(this.task, linkedAssignments);
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
