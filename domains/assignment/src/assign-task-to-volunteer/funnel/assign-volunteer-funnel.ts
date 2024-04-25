import { Assignment, TeamDemanded, isMemberOf } from "../assignment";
import { ReadyToStart } from "./startup-funnel";
import { Candidate, isFulfillingDemand } from "./candidate";
import {
  CommonFunnel,
  areEveryCandidateFulfillingDemand,
} from "./funnel-shared-logic";
import {
  FunnelRepositories,
  IActAsFunnel,
  FunnelError,
  FulfillDemand,
} from "./funnel";
import { AssignableVolunteer } from "../assignable-volunteer";

type ActiveFunnelInitializer = [Candidate[], FunnelRepositories, Assignment];

export class AssignVolunteerFunnel
  extends CommonFunnel
  implements IActAsFunnel
{
  static init(initializer: ActiveFunnelInitializer) {
    const [candidates, repositories, assignment] = initializer;
    return new AssignVolunteerFunnel(candidates, repositories, assignment);
  }

  async assign(): Promise<ReadyToStart> {
    if (!areEveryCandidateFulfillingDemand(this._candidates)) {
      return Promise.reject(
        new FunnelError("Les candidats ne sont pas tous affecte a une equipe"),
      );
    }
    const { taskId, mobilizationId, assignmentId } = this.assignment;
    const assignment = { taskId, mobilizationId, assignmentId };
    const volunteers = this._candidates.map(({ json }) =>
      Candidate.toAssignment(json),
    );
    await this.repositories.assignments.assign({ assignment, volunteers });

    const { candidateFactory, assignments } = this.repositories;
    return ReadyToStart.init(candidateFactory, assignments);
  }

  async addCandidate(): Promise<IActAsFunnel> {
    if (!this.canFulfillMoreRemainingDemands) return Promise.resolve(this);

    const [nextFriend] = this.friendsAbleToFulfillNextDemand;
    const asCandidate = await this.toCandidate(nextFriend);

    const candidates = [...this._candidates, asCandidate];
    const assignedCandidates =
      this.assignCandidateAccordingToRemainingDemands(candidates);

    return new AssignVolunteerFunnel(
      assignedCandidates,
      this.repositories,
      this.assignment,
    );
  }

  private assignCandidateAccordingToRemainingDemands(
    candidates: Candidate[],
  ): Candidate[] {
    const remainingDemands = this.remainingDemandsIfAssignThose(candidates);

    const assignedCandidates = candidates.map((candidate) => {
      if (isFulfillingDemand(candidate.json)) return candidate;

      const remainingAssignableTeams =
        candidate.assignableTeamsAccordingTo(remainingDemands);
      if (remainingAssignableTeams.length > 1) return candidate;

      const [lastRemainingTeam] = remainingAssignableTeams;
      return candidate.demandAs(lastRemainingTeam);
    });

    return assignedCandidates;
  }

  private remainingDemandsIfAssignThose(candidates: Candidate[]) {
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

  private toCandidate(friend: AssignableVolunteer) {
    return this.repositories.candidateFactory.from(friend, this.assignment);
  }

  fulfillDemand({ volunteer, team }: FulfillDemand): IActAsFunnel {
    const hasTeamAllDemandsFulfilled = this.hasTeamAllDemandsFulfilled(team);
    if (hasTeamAllDemandsFulfilled) return this;

    const candidates = this._candidates.map((candidate) =>
      candidate.json.id === volunteer ? candidate.demandAs(team) : candidate,
    );
    const assignedCandidates =
      this.assignCandidateAccordingToRemainingDemands(candidates);
    return new AssignVolunteerFunnel(
      assignedCandidates,
      this.repositories,
      this.assignment,
    );
  }

  private hasTeamAllDemandsFulfilled(teamToAnalyse: string) {
    const teamRemainingDemands = this.remainingDemandsIfAssignThose(
      this._candidates,
    ).filter(({ demand, team }) => team === teamToAnalyse && demand > 0);

    return teamRemainingDemands.length === 0;
  }

  revokeLastCandidate(): IActAsFunnel {
    if (!this.canRevokeLastCandidate) return this;
    const candidates = this._candidates.slice(0, -1);
    return new AssignVolunteerFunnel(
      candidates,
      this.repositories,
      this.assignment,
    );
  }

  private async countBasedCandidateSelection(
    increment: number,
  ): Promise<IActAsFunnel> {
    if (!this.canChangeLastCandidate) return Promise.resolve(this);
    const currentFriend = this._candidates.at(-1);
    if (!currentFriend) return Promise.resolve(this);

    const friendsAssignableOnLastDemand = this.friendsAssignableOnLastDemand;
    const currentFriendIndex = friendsAssignableOnLastDemand.findIndex(
      ({ id }) => currentFriend.json.id === id,
    );
    const totalAssignableFriends = friendsAssignableOnLastDemand.length;
    const nextIndex = (currentFriendIndex + increment) % totalAssignableFriends;
    const nextFriend = friendsAssignableOnLastDemand.at(nextIndex);
    if (!nextFriend) return Promise.resolve(this);

    const otherCandidatesThanTheLastOne = this.otherCandidatesThanTheLastOne;
    const asCandidate = await this.toCandidate(nextFriend);
    const candidates = [...otherCandidatesThanTheLastOne, asCandidate];
    const assignedCandidates =
      this.assignCandidateAccordingToRemainingDemands(candidates);
    return new AssignVolunteerFunnel(
      assignedCandidates,
      this.repositories,
      this.assignment,
    );
  }

  async previousCandidate(): Promise<IActAsFunnel> {
    return this.countBasedCandidateSelection(-1);
  }

  nextCandidate(): Promise<IActAsFunnel> {
    return this.countBasedCandidateSelection(+1);
  }
}
