import { Assignment, TeamDemanded } from "../assignment";
import {
  Candidate, CandidateFulfillingDemand,
  IDefineCandidate,
  isFulfillingDemand
} from "./candidate";
import { Volunteer } from "./volunteer";
import { FunnelRepositories, IActAsFunnel, FulfillDemand } from "./funnel";

export abstract class CommonFunnel {
  protected constructor(
    protected readonly _candidates: Candidate[],
    protected readonly repositories: FunnelRepositories,
    protected readonly assignment: Assignment
  ) { }

  get candidates(): IDefineCandidate[] {
    return this._candidates.map(({ json }) => json);
  }

  get canAssign(): boolean {
    return areEveryCandidateFulfillingDemand(this._candidates);
  }

  abstract assign(): Promise<IActAsFunnel>;

  get canFulfillMoreRemainingDemands(): boolean {
    const { demands, assignees } = this.assignment;
    const totalDemands = sumDemands(demands);
    const totalAssignees = assignees.length;
    const totalCandidates = this._candidates.length;
    const hasRemainingDemands = totalCandidates < totalDemands - totalAssignees;

    const hasAssignableFriends = this.hasAssignableFriends(this._candidates);
    return hasRemainingDemands && hasAssignableFriends;
  }

  protected get friendsAbleToFulfillNextDemand(): Volunteer[] {
    return this.assignableFriendsFrom(this._candidates);
  }

  protected get friendsAssignableOnLastDemand(): Volunteer[] {
    return this.assignableFriendsFrom(this.otherCandidatesThanTheLastOne);
  }

  private hasAssignableFriends(candidates: Candidate[]) {
    const assignableFriends = this.assignableFriendsFrom(candidates);

    const hasAssignableFriends = assignableFriends.length > 0;
    return hasAssignableFriends;
  }

  private assignableFriendsFrom(candidates: Candidate<IDefineCandidate>[]) {
    return candidates
      .flatMap((candidate) => candidate.json.friends)
      .filter((friend) => {
        return (
          candidates.every(({ json }) => json.id !== friend.id) &&
          isAssignable(this.assignment, friend)
        );
      });
  }

  abstract addCandidate(): Promise<IActAsFunnel>;

  abstract fulfillDemand(volunteer: FulfillDemand): IActAsFunnel;

  get canRevokeLastCandidate(): boolean {
    return this._candidates.length > 1;
  }

  abstract revokeLastCandidate(): IActAsFunnel;

  private get otherCandidatesThanTheLastOne(): Candidate[] {
    return this._candidates.slice(0, -1);
  }

  get canSelectLastCandidate(): boolean {
    return this.hasAssignableFriends(this.otherCandidatesThanTheLastOne);
  }

  abstract previousCandidate(): Promise<IActAsFunnel>;
  abstract nextCandidate(): Promise<IActAsFunnel>;
}
function sumDemands(demands: TeamDemanded[]) {
  return demands.reduce((sum, { demand: count }) => sum + count, 0);
}
function isAssignable(assignment: Assignment, volunteer: Volunteer) {
  return Candidate.getAssignableTeams(assignment, volunteer.teams).length > 0;
}
export function areEveryCandidateFulfillingDemand(
  candidates: Candidate[]
): candidates is Candidate<CandidateFulfillingDemand>[] {
  return candidates.every((candidate) => isFulfillingDemand(candidate.json));
}
