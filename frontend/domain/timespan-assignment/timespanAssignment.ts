import { updateItemToList } from "~/utils/functions/list";
import { Volunteer } from "~/utils/models/assignment";
import { VolunteerTask } from "~/utils/models/user";
import { getUnderlyingTeams } from "./underlying-teams";

type TeamRequest = {
  teamCode: string;
  quantity: number;
  assignments: number;
};

type Task = {
  name: string;
  start: Date;
  end: Date;
  id: number;
};

export class AssignmentCandidate {
  tasks: VolunteerTask[] = [];
  private _assignment: string = "";

  constructor(readonly volunteer: Volunteer) {}

  private canBeAssignedAs(teamCode: string): boolean {
    const underlyingTeams = getUnderlyingTeams(this.volunteer.teams);
    const teams = [...this.volunteer.teams, ...underlyingTeams];
    return teams.includes(teamCode);
  }

  assign(team: string) {
    if (!this.canBeAssignedAs(team)) return;
    this._assignment = team;
  }

  unassign() {
    this._assignment = "";
  }

  get assignment(): string {
    return this._assignment;
  }

  assignableTeams(teamsRequested: string[]): string[] {
    const underlyingTeams = getUnderlyingTeams(this.volunteer.teams);
    const teams = [...this.volunteer.teams, ...underlyingTeams];
    return teams.filter((team) => teamsRequested.includes(team));
  }
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
    return this.teamRequests
      .filter(({ quantity, assignments }) => quantity > assignments)
      .map(({ teamCode }) => teamCode);
  }

  addCandidate(candidate: AssignmentCandidate): TaskAssignment {
    const assignableTeams = candidate.assignableTeams(
      this.remainingTeamRequest
    );
    if (assignableTeams.length === 1) {
      candidate.assign(assignableTeams[0]);
    }
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

  assignCandidate(id: number, team: string) {
    const candidate = this.getCandidate(id);
    if (!candidate) return;
    candidate.assign(team);
  }

  unassignCandidate(id: number) {
    const candidate = this.getCandidate(id);
    if (!candidate) return;
    candidate.unassign();
  }

  get assignments() {
    return this._candidates
      .filter((candidate) => candidate.assignment !== "")
      .map((candidate) => ({
        timespanId: this.task.id,
        teamCode: candidate.assignment,
        volunteerId: candidate.volunteer.id,
      }));
  }
}
