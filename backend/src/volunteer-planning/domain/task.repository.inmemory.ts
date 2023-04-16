import { TaskRepository } from './planning';
import { JsonStoredTask } from './storedTask';

export class InMemoryTaskRepository implements TaskRepository {
  constructor(private tasks: JsonStoredTask[]) {}

  getVolunteerTasksInChronologicalOrder(
    volunteerId: number,
  ): Promise<JsonStoredTask[]> {
    return Promise.resolve(
      this.tasks
        .filter(({ assignees }) =>
          assignees.some(({ id }) => id === volunteerId),
        )
        .sort((a, b) => a.period.start.getTime() - b.period.start.getTime()),
    );
  }
}
