export class AssignmentError extends Error {}

export class TaskNotFoundError extends AssignmentError {
  constructor(taskId: number) {
    super(`La FT #${taskId} est introuvable`);
  }
}

export class WrongTeam extends AssignmentError {
  constructor(volunteerId: number, teamCode: string) {
    super(
      `La bénévole #${volunteerId} ne peut pas être affecté en tant que ${teamCode}`,
    );
  }
}
