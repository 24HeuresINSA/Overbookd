import { Period } from "@overbookd/period";
import { removeItemAtIndex, updateItemToList } from "@overbookd/list";
import { Volunteer } from "~/utils/models/assignment.model";
import { VolunteerTask } from "~/utils/models/user";
import { getUnderlyingTeams } from "./underlying-teams";

type TeamRequest = {
  teamCode: string;
  quantity: number;
  assignments: number;
};

export type Task = {
  name: string;
  start: Date;
  end: Date;
  id: number;
};

export class AssignmentCandidate {
  tasks: VolunteerTask[] = [];
  private _assignment: string = "";
  availabilities: Period[] = [];

  constructor(readonly volunteer: Volunteer) {}

  canBeAssignedAs(teamCode: string): boolean {
    const underlyingTeams = getUnderlyingTeams(this.volunteer.teams);
    const teams = [...this.volunteer.teams, ...underlyingTeams];
    return teams.includes(teamCode);
  }

  assign(team: string) {
    if (!this.canBeAssignedAs(team)) return;
    this._assignment = team;
  }

  unassign() {
    if (this.assignableTeams.length === 1) return;
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
  private _friends: Volunteer[] = [];
  private _potentialCandidates: Volunteer[] = [];

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
      this.remainingTeamRequestsAfterAssignment,
    );
    if (assignableTeams.length === 1) {
      candidate.assign(assignableTeams[0]);
    }
    this._candidates = [...this._candidates, candidate];
    this._potentialCandidates = [...this._friends];
    return this;
  }

  removeLastCandidate(): TaskAssignment {
    const hasOnlyOneCandidate = this._candidates.length === 1;
    if (hasOnlyOneCandidate) return this;

    this._candidates = removeItemAtIndex(
      this._candidates,
      this._candidates.length - 1,
    );
    return this;
  }

  replaceCandidateBy(
    id: number,
    candidate: AssignmentCandidate,
  ): TaskAssignment {
    const remainingCandidates = this.candidates.filter(
      (c) => c.volunteer.id !== id,
    );
    if (remainingCandidates.length === this.candidates.length) return this;
    this._candidates = remainingCandidates;
    return this.addCandidate(candidate);
  }

  get candidates(): AssignmentCandidate[] {
    return this._candidates;
  }

  withCandidateTasks(id: number, tasks: VolunteerTask[]): TaskAssignment {
    const candidateIndex = this._candidates.findIndex(
      (candidate) => candidate.volunteer.id === id,
    );

    if (candidateIndex === -1) return this;
    const candidate = this._candidates.at(candidateIndex);
    if (!candidate) return this;

    candidate.tasks = tasks;
    this._candidates = updateItemToList(
      this._candidates,
      candidateIndex,
      candidate,
    );

    return this;
  }

  withCandidateAvailabilities(
    id: number,
    availabilities: Period[],
  ): TaskAssignment {
    const candidateIndex = this._candidates.findIndex(
      (candidate) => candidate.volunteer.id === id,
    );

    if (candidateIndex === -1) return this;
    const candidate = this._candidates.at(candidateIndex);
    if (!candidate) return this;

    candidate.availabilities = availabilities;
    this._candidates = updateItemToList(
      this._candidates,
      candidateIndex,
      candidate,
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
    const volunteers = this._candidates
      .filter((candidate) => candidate.assignment !== "")
      .map((candidate) => ({
        teamCode: candidate.assignment,
        id: candidate.volunteer.id,
      }));
    const timeSpanId = this.task.id;
    return { volunteers, timeSpanId };
  }

  withCandidatesFriends(friends: Volunteer[]): TaskAssignment {
    this._friends = friends.sort((a, b) => a.id - b.id);
    return this;
  }

  get candidateToRetrieveFriendsFor(): AssignmentCandidate[] {
    const endIndex = this._candidates.length === 1 ? 1 : -1;
    return this._candidates.slice(0, endIndex);
  }

  get candidateFriends(): Volunteer[] {
    return this._friends.filter(
      (friend) =>
        !this.getCandidate(friend.id) &&
        this.canBeAssigned(friend, this.remainingTeamRequestsAfterAssignment),
    );
  }

  get potentialCandidates(): Volunteer[] {
    return this._potentialCandidates.filter(
      (potentialCandidate) =>
        !this.getCandidate(potentialCandidate.id) &&
        this.canBeAssigned(potentialCandidate, this.remainingTeamRequest),
    );
  }

  get canAssignMoreVolunteer(): boolean {
    return (
      this.areRemainingTeamRequests &&
      this.areFriendsAvailable &&
      this.areNotEnoughCandidate
    );
  }

  private get areNotEnoughCandidate(): boolean {
    const requirements = this.teamRequests.reduce(
      (sum, { quantity, assignments }) => sum + quantity - assignments,
      0,
    );
    return requirements > this.candidates.length;
  }

  private get areRemainingTeamRequests() {
    return this.remainingTeamRequestsAfterAssignment.length > 0;
  }

  private get remainingTeamRequestsAfterAssignment(): string[] {
    return this.teamRequests
      .filter((teamRequest) =>
        this.isRemainingTeamRequestAfterAssignment(teamRequest),
      )
      .map(({ teamCode }) => teamCode);
  }

  private isRemainingTeamRequestAfterAssignment({
    quantity,
    assignments,
    teamCode,
  }: TeamRequest): boolean {
    return quantity > assignments + this.countCandidateAssignedTo(teamCode);
  }

  private countCandidateAssignedTo(teamCode: string): number {
    return this._candidates.filter(
      (candidate) => candidate.assignment === teamCode,
    ).length;
  }

  private get areFriendsAvailable(): boolean {
    return this.candidateFriends.length > 0;
  }

  private canBeAssigned(
    volunteer: Volunteer,
    remainingTeamRequests: string[],
  ): boolean {
    const asCandidate = new AssignmentCandidate(volunteer);
    const assignableTeams = asCandidate.assignableTeams(remainingTeamRequests);
    return assignableTeams.length > 0;
  }

  changeLastCandidateToPreviousFriend(): TaskAssignment {
    const strategy = new PreviousCandidateReplacementStrategy();
    return this.replaceCandidate(strategy);
  }

  changeLastCandidateToNextFriend(): TaskAssignment {
    const strategy = new NextCandidateReplacementStrategy();
    return this.replaceCandidate(strategy);
  }

  private replaceCandidate(strategy: ReplacementStrategy): TaskAssignment {
    const lastCandidate = this.candidates.at(-1);
    if (!lastCandidate) return this;
    const newCandidate = strategy.findNewCandidate(
      lastCandidate,
      this.potentialCandidates,
    );
    if (!newCandidate) return this;
    return this.replaceCandidateBy(lastCandidate.volunteer.id, newCandidate);
  }

  get canAssign(): boolean {
    return (
      this.areAllTeamRequestBelowMaxCapacity && this.areAllCandidateAssigned
    );
  }

  private get areAllCandidateAssigned(): boolean {
    return this.candidates.every((candidate) => candidate.assignment !== "");
  }

  private get areAllTeamRequestBelowMaxCapacity(): boolean {
    return this.teamRequests.every(
      ({ teamCode, quantity, assignments }) =>
        assignments + this.countCandidateAssignedTo(teamCode) <= quantity,
    );
  }
}

interface ReplacementStrategy {
  findNewCandidate(
    lastCandidate: AssignmentCandidate,
    potentialCandidates: Volunteer[],
  ): AssignmentCandidate | undefined;
}

class NextCandidateReplacementStrategy implements ReplacementStrategy {
  findNewCandidate(
    lastCandidate: AssignmentCandidate,
    potentialCandidates: Volunteer[],
  ): AssignmentCandidate | undefined {
    const nextFriend =
      potentialCandidates.find(
        (friend) => friend.id > lastCandidate.volunteer.id,
      ) ?? potentialCandidates.at(0);
    if (!nextFriend) return undefined;
    return new AssignmentCandidate(nextFriend);
  }
}

class PreviousCandidateReplacementStrategy implements ReplacementStrategy {
  findNewCandidate(
    lastCandidate: AssignmentCandidate,
    potentialCandidates: Volunteer[],
  ): AssignmentCandidate | undefined {
    const previousFriend =
      [...potentialCandidates]
        .reverse()
        .find((friend) => friend.id < lastCandidate.volunteer.id) ??
      potentialCandidates.at(-1);
    if (!previousFriend) return undefined;
    return new AssignmentCandidate(previousFriend);
  }
}
