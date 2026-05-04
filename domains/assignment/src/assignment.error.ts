import type { Period } from "@overbookd/time";

export class AssignmentError extends Error {}

export class TaskNotFoundError extends AssignmentError {
  constructor(taskId: number) {
    super(`La FT #${taskId} est introuvable`);
  }
}

export class WrongTeam extends AssignmentError {
  constructor(volunteerId: number, teamCode: string) {
    super(
      `Le·la bénévole #${volunteerId} ne peut pas être affecté·e en tant que ${teamCode}`,
    );
  }
}

export class Unavailable extends AssignmentError {
  constructor(volunteerId: number, period: Period) {
    super(
      `Le·la bénévole #${volunteerId} n'est pas disponible sur la période ${period}`,
    );
  }
}

export class AlreadyAssigned extends AssignmentError {
  constructor(volunteerId: number, period: Period) {
    super(
      `Le·la bénévole #${volunteerId} est déjà affecté sur la période ${period}`,
    );
  }
}

export class HasBreak extends AssignmentError {
  constructor(volunteerId: number, period: Period) {
    super(
      `Le·la bénévole #${volunteerId} est en pause sur la période ${period}`,
    );
  }
}
