import { TaskAssignments } from "../assign-volunteer-to-task";

export class InMemoryTaskAssignments implements TaskAssignments {
  constructor() {}

  findOn(periods: Period[], oneOfTheTeams: string[]): Promise<[]> {
    return Promise.resolve([]);
  }
}
