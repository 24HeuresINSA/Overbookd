import { Assignment } from "../assignment";
import { ReadyToStart } from "./startup-funnel";
import { Candidate } from "./candidate";
import { Volunteer } from "./volunteer";
import {
  CommonFunnel,
  areEveryCandidateFulfillingDemand
} from "./funnel-shared-logic";
import { FunnelRepositories, IActAsFunnel, FunnelError, FulfillDemand } from "./funnel";

type ActiveFunnelInitializer = [Candidate[], FunnelRepositories, Assignment];

export class Funnel extends CommonFunnel implements IActAsFunnel {
  static init(initializer: ActiveFunnelInitializer) {
    const [candidates, repositories, assignment] = initializer;
    return new Funnel(candidates, repositories, assignment);
  }

  async assign(): Promise<ReadyToStart> {
    if (!areEveryCandidateFulfillingDemand(this._candidates)) {
      return Promise.reject(
        new FunnelError("Les candidats ne sont pas tous affecte a une equipe")
      );
    }
    const { taskId, mobilizationId, assignmentId } = this.assignment;
    const assignment = { taskId, mobilizationId, assignmentId };
    const volunteers = this._candidates.map(({ json }) => Candidate.toAssignment(json)
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

    return new Funnel(candidates, this.repositories, this.assignment);
  }

  private toCandidate(friend: Volunteer) {
    return this.repositories.candidateFactory.from(friend, this.assignment);
  }

  fulfillDemand({ volunteer, team }: FulfillDemand): IActAsFunnel {
    const candidates = this._candidates.map((candidate) => candidate.json.id === volunteer ? candidate.demandAs(team) : candidate
    );
    return new Funnel(candidates, this.repositories, this.assignment);
  }

  revokeLastCandidate(): IActAsFunnel {
    if (!this.canRevokeLastCandidate) return this;
    const candidates = this._candidates.slice(0, -1);
    return new Funnel(candidates, this.repositories, this.assignment);
  }

  private async countBasedCandidateSelection(
    increment: number
  ): Promise<IActAsFunnel> {
    if (!this.canSelectLastCandidate) return Promise.resolve(this);
    const currentFriend = this._candidates.at(-1);
    if (!currentFriend) return Promise.resolve(this);

    const friendsAssignableOnLastDemand = this.friendsAssignableOnLastDemand;
    const currentFriendIndex = friendsAssignableOnLastDemand.findIndex(
      ({ id }) => currentFriend.json.id === id
    );
    const totalAssignableFriends = friendsAssignableOnLastDemand.length;
    const nextIndex = (currentFriendIndex + increment) % totalAssignableFriends;
    const nextFriend = friendsAssignableOnLastDemand.at(nextIndex);
    if (!nextFriend) return Promise.resolve(this);

    const asCandidate = await this.toCandidate(nextFriend);
    const candidates = [...this._candidates, asCandidate];
    return new Funnel(candidates, this.repositories, this.assignment);
  }

  async previousCandidate(): Promise<IActAsFunnel> {
    return this.countBasedCandidateSelection(+1);
  }

  nextCandidate(): Promise<IActAsFunnel> {
    return this.countBasedCandidateSelection(-1);
  }
}
