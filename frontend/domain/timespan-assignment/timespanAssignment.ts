import { updateItemToList } from "~/utils/functions/list";
import { Volunteer } from "~/utils/models/assignment";
import { VolunteerTask } from "~/utils/models/user";

type TeamRequest = {
  teamCode: string;
  quantity: number;
};

type Task = {
  name: string;
  start: Date;
  end: Date;
  id: number;
};

export class AssignmentCandidate {
  tasks: VolunteerTask[] = [];

  constructor(readonly volunteer: Volunteer) {}
}

export class TaskAssignment {
  private teamRequests: TeamRequest[] = [];
  private _candidates: AssignmentCandidate[] = [];

  private constructor(readonly task: Task) {}

  static init(task?: Task) {
    const defaultTask = {
      name: "Task",
      id: 0,
      start: new Date(),
      end: new Date(),
    };
    return new TaskAssignment(task ?? defaultTask);
  }

  withRemaingTeamRequests(remainingTeamRequest: TeamRequest[]): TaskAssignment {
    this.teamRequests = remainingTeamRequest;
    return this;
  }

  get remainingTeamRequest(): string[] {
    return this.teamRequests.map(({ teamCode }) => teamCode);
  }

  addCandidate(candidate: AssignmentCandidate): TaskAssignment {
    this._candidates = [...this._candidates, candidate];
    return this;
  }

  get candidates(): AssignmentCandidate[] {
    return this._candidates;
  }

  withCandidateTasks(id: number, tasks: VolunteerTask[]): TaskAssignment {
    const candidateIndex = this._candidates.findIndex(
      (candidate) => candidate.volunteer.id === id
    );

    if (candidateIndex === -1) return this;
    const candidate = this._candidates.at(candidateIndex);
    if (!candidate) return this;

    candidate.tasks = tasks;
    this._candidates = updateItemToList(
      this._candidates,
      candidateIndex,
      candidate
    );

    return this;
  }

  getCandidate(id: number): AssignmentCandidate | undefined {
    return this._candidates.find((candidate) => candidate.volunteer.id === id);
  }
}
