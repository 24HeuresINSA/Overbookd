export class AssignmentError extends Error {}

export class TaskNotFoundError extends AssignmentError {
  constructor(taskId: number) {
    super(`La FT #${taskId} est introuvable`);
  }
}
