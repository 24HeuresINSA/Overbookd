import { AssignableVolunteer } from "../assignable-volunteer.js";
import { Assignment, TeamDemanded, isMemberOf } from "../assignment.js";
import {
  Candidate,
  CandidateFulfillingDemand,
  IDefineCandidate,
  isFulfillingDemand,
} from "./candidate.js";
import {
  FunnelRepositories,
  IActAsFunnel,
  FulfillDemand,
  IStartupFunnel,
} from "./funnel.js";

export abstract class CommonFunnel implements IActAsFunnel {
  protected constructor(
    protected readonly _candidates: Candidate[],
    protected readonly repositories: FunnelRepositories,
    protected readonly assignment: Assignment,
  ) {}

  get candidates(): IDefineCandidate[] {
    return this._candidates.map(({ json }) => json);
  }

  get canAssign(): boolean {
    return areEveryCandidateFulfillingDemand(this._candidates);
  }

  abstract assign(): Promise<IStartupFunnel>;

  get canFulfillMoreRemainingDemands(): boolean {
    const candidates = this._candidates;
    const canFulfillAllDemands = this.canTheyFulfillAllDemands(candidates);
    if (canFulfillAllDemands) return false;

    return this.hasAssignableFriends(candidates);
  }

  private canTheyFulfillAllDemands(
    candidates: Candidate<IDefineCandidate>[],
  ): boolean {
    const remainingDemands = this.remainingDemandsIfAssignThose(candidates);
    const candidatesWithoutSelectedTeam = candidates.filter(
      (candidate) => !isFulfillingDemand(candidate.json),
    );
    const totalRemainingDemands = remainingDemands.reduce(
      (total, { demand }) => total + demand,
      0,
    );
    const totalAssignableCandidates = candidatesWithoutSelectedTeam.length;
    return totalAssignableCandidates === totalRemainingDemands;
  }

  protected remainingDemandsIfAssignThose(candidates: Candidate[]) {
    const { assignees, demands } = this.assignment;
    const remainingDemands = demands.reduce(
      (remainingDemands: TeamDemanded[], { team, demand }) => {
        const alreadyAssigned = assignees.filter(isMemberOf(team)).length;
        const temporarlyAssigned = candidates.filter((candidate) =>
          isMemberOf(team)(candidate.json),
        ).length;
        const totalAssignees = alreadyAssigned + temporarlyAssigned;
        if (totalAssignees === demand) return remainingDemands;

        return [...remainingDemands, { team, demand: demand - totalAssignees }];
      },
      [],
    );
    return remainingDemands;
  }

  protected get friendsAbleToFulfillNextDemand(): AssignableVolunteer[] {
    return this.assignableFriendsFrom(this._candidates);
  }

  protected get friendsAssignableOnLastDemand(): AssignableVolunteer[] {
    return this.assignableFriendsFrom(this.otherCandidatesThanTheLastOne);
  }

  private hasAssignableFriends(candidates: Candidate[]) {
    const assignableFriends = this.assignableFriendsFrom(candidates);

    const hasAssignableFriends = assignableFriends.length > 0;
    return hasAssignableFriends;
  }

  private assignableFriendsFrom(candidates: Candidate<IDefineCandidate>[]) {
    const remainingDemands = this.remainingDemandsIfAssignThose(candidates);
    const assignment = { ...this.assignment, demands: remainingDemands };
    return candidates
      .flatMap((candidate) => candidate.json.friends)
      .reduce((friends: AssignableVolunteer[], friend) => {
        const isNotACandidateYet = candidates.every(
          ({ json }) => json.id !== friend.id,
        );
        const isAssignable = isAssignableOn(assignment, friend);
        const isNotAlreadyListed = friends.every(({ id }) => id !== friend.id);

        const shouldBeAdded =
          isNotACandidateYet && isAssignable && isNotAlreadyListed;
        if (!shouldBeAdded) return friends;

        return [...friends, friend];
      }, []);
  }

  abstract addCandidate(): Promise<IActAsFunnel>;

  abstract fulfillDemand(volunteer: FulfillDemand): IActAsFunnel;

  get canRevokeLastCandidate(): boolean {
    return this._candidates.length > 1;
  }

  abstract revokeLastCandidate(): IActAsFunnel;

  protected get otherCandidatesThanTheLastOne(): Candidate[] {
    return this._candidates.slice(0, -1);
  }

  get canChangeLastCandidate(): boolean {
    const selectableFriends = this.assignableFriendsFrom(
      this.otherCandidatesThanTheLastOne,
    );
    return selectableFriends.length > 1;
  }

  abstract previousCandidate(): Promise<IActAsFunnel>;
  abstract nextCandidate(): Promise<IActAsFunnel>;
}

function isAssignableOn(
  assignment: Assignment,
  volunteer: AssignableVolunteer,
) {
  return Candidate.getAssignableTeams(assignment, volunteer.teams).length > 0;
}

export function areEveryCandidateFulfillingDemand(
  candidates: Candidate[],
): candidates is Candidate<CandidateFulfillingDemand>[] {
  return candidates.every((candidate) => isFulfillingDemand(candidate.json));
}
