import {
  Candidate,
  IDefineCandidate,
  CandidateFulfillingDemand,
  CandidateFactory,
  isFulfillingDemand,
} from "./candidate";
import { Volunteer } from "./volunteer";
import { Assignment } from "../../common/assignment";
import { Assignments } from "../../common/repositories/assignments";

/*
State Machine
canFulfillMoreDemands
isSingle | hasAllTeamLinked | (i.e. available friends AND remaining demands) | hasOtherFriendsAvailable |
x        | x                | x                                              | x                        | => assign, addCandidate
x        | x                | x                                              | o                        | => assign, addCandidate
x        | x                | o                                              | x                        | => assign
x        | x                | o                                              | o                        | => assign
x        | o                | x                                              | x                        | => fulfillDemand, addCandidate
x        | o                | x                                              | o                        | => fulfillDemand, addCandidate
x        | o                | o                                              | x                        | => fulfillDemand
x        | o                | o                                              | o                        | => fulfillDemand
o        | x                | x                                              | x                        | => revokeLastCandidate, assign, addCandidate, nextCandidate, previousCanidate
o        | x                | x                                              | o                        | => revokeLastCandidate, assign, addCandidate
o        | x                | o                                              | x                        | => revokeLastCandidate, assign, nextCandidate, previousCandidate
o        | x                | o                                              | o                        | => revokeLastCandidate, assign
o        | o                | x                                              | x                        | => revokeLastCandidate, fulfillDemand, addCandidate, nextCandidate, previousCandidate
o        | o                | x                                              | o                        | => revokeLastCandidate, fulfillDemand, addCandidate
o        | o                | o                                              | x                        | => revokeLastCandidate, fulfillDemand, nextCandidate, previousCandidate
o        | o                | o                                              | o                        | => revokeLastCandidate, fulfillDemand
*/

export type IamActiveFunnel<C extends IDefineCandidate> = {
  candidates: C[];
  hasRemainingDemands: boolean;
};

type IAmReadyToAssign = {
  assign(): Promise<Assignment>;
};

type NextStateAddingCandidateWhenOtherCanFulfillDemands =
  | IHaveManyCandidatesWhoCanFulfillDemandsAndSomeFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable
  | IHaveManyCandidatesWhoCanFulfillDemandsAndSomeFriendsCanFulfillMoreDemandsButNoneOfFriendsCanFulfillMoreDemands
  | IHaveManyCandidatesWhoCanFulfillDemandsButNoneOfFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable
  | IHaveManyCandidatesWhoCanFulfillDemandsButNoneOfFriendsCanFulfillMoreDemandsAndNoneOfFriendsCanFulfillMoreDemands;

type NextStateAddingCandidateWhenOtherAreReadyToAssign =
  | IHaveManyCandidatesWhoAreReadyToAssignAndSomeFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable
  | IHaveManyCandidatesWhoAreReadyToAssignAndSomeFriendsCanFulfillMoreDemandsButNoneOtherFriendsAvailable
  | IHaveManyCandidatesWhoAreReadyToAssignButNoneOfFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable
  | IHaveManyCandidatesWhoAreReadyToAssignButNoneOfFriendsCanFulfillMoreDemandsAndNoneOfFriendsCanFulfillMoreDemands
  | NextStateAddingCandidateWhenOtherCanFulfillDemands;

type NextStateSelectingCandidate =
  | IHaveManyCandidatesWhoAreReadyToAssignAndSomeFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable
  | IHaveManyCandidatesWhoAreReadyToAssignButNoneOfFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable
  | IHaveManyCandidatesWhoCanFulfillDemandsAndSomeFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable
  | IHaveManyCandidatesWhoCanFulfillDemandsButNoneOfFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable;

type NextStateRevokingCandidateWhenOtherAreReadyToAssign =
  | IHaveManyCandidatesWhoAreReadyToAssignAndSomeFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable
  | IHaveManyCandidatesWhoAreReadyToAssignAndSomeFriendsCanFulfillMoreDemandsButNoneOtherFriendsAvailable
  | IHaveOnlyOneCandidateWhoIsReadyToAssignAndSomeFriendsCanFulfillMoreDemands;

type NextStateRevokingCandidateWhenOtherCanFulfillDemands =
  | NextStateRevokingCandidateWhenOtherAreReadyToAssign
  | IHaveManyCandidatesWhoCanFulfillDemandsAndSomeFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable
  | IHaveManyCandidatesWhoCanFulfillDemandsAndSomeFriendsCanFulfillMoreDemandsButNoneOfFriendsCanFulfillMoreDemands
  | IHaveOnlyOneCandidateWhoCanFulfillDemandsAndSomeFriendsCanFulfillMoreDemands;

type IHaveOnlyOneCandidateWhoIsReadyToAssignAndSomeFriendsCanFulfillMoreDemands =
  IAmReadyToAssign & {
    addCandidate(): NextStateAddingCandidateWhenOtherAreReadyToAssign;
  };

export type IHaveOnlyOneCandidateWhoIsReadyToAssignButNoneOfFriendsCanFulfillMoreDemands =
  IAmReadyToAssign;

type IHaveOnlyOneCandidateWhoCanFulfillDemandsAndSomeFriendsCanFulfillMoreDemands =
  {
    fulfillDemand(
      volunteer: FulfillDemand,
    ): IHaveOnlyOneCandidateWhoIsReadyToAssignAndSomeFriendsCanFulfillMoreDemands;
    addCandidate(): NextStateAddingCandidateWhenOtherCanFulfillDemands;
  };

export type IHaveOnlyOneCandidateWhoCanFulfillDemandsButNoneOfFriendsCanFulfillMoreDemands =
  {
    fulfillDemand(
      volunteer: FulfillDemand,
    ): IHaveOnlyOneCandidateWhoIsReadyToAssignButNoneOfFriendsCanFulfillMoreDemands;
  };

type IHaveManyCandidatesWhoAreReadyToAssignAndSomeFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable =
  IAmReadyToAssign & {
    revokeLastCandidate():
      | IHaveManyCandidatesWhoAreReadyToAssignAndSomeFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable
      | IHaveOnlyOneCandidateWhoIsReadyToAssignAndSomeFriendsCanFulfillMoreDemands;
    addCandidate(): NextStateAddingCandidateWhenOtherAreReadyToAssign;
    nextCandidate(): NextStateSelectingCandidate;
    previousCandidate(): NextStateSelectingCandidate;
  };

type IHaveManyCandidatesWhoAreReadyToAssignAndSomeFriendsCanFulfillMoreDemandsButNoneOtherFriendsAvailable =
  IAmReadyToAssign & {
    revokeLastCandidate():
      | IHaveManyCandidatesWhoAreReadyToAssignAndSomeFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable
      | IHaveManyCandidatesWhoAreReadyToAssignAndSomeFriendsCanFulfillMoreDemandsButNoneOtherFriendsAvailable
      | IHaveOnlyOneCandidateWhoIsReadyToAssignAndSomeFriendsCanFulfillMoreDemands;
    addCandidate(): NextStateAddingCandidateWhenOtherAreReadyToAssign;
  };

type IHaveManyCandidatesWhoAreReadyToAssignButNoneOfFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable =
  IAmReadyToAssign & {
    revokeLastCandidate(): NextStateRevokingCandidateWhenOtherAreReadyToAssign;
    nextCandidate(): NextStateSelectingCandidate;
    previousCandidate(): NextStateSelectingCandidate;
  };

type IHaveManyCandidatesWhoAreReadyToAssignButNoneOfFriendsCanFulfillMoreDemandsAndNoneOfFriendsCanFulfillMoreDemands =
  IAmReadyToAssign & {
    revokeLastCandidate(): NextStateRevokingCandidateWhenOtherAreReadyToAssign;
  };

type IHaveManyCandidatesWhoCanFulfillDemandsButNoneOfFriendsCanFulfillMoreDemandsAndNoneOfFriendsCanFulfillMoreDemands =
  {
    revokeLastCandidate(): NextStateRevokingCandidateWhenOtherCanFulfillDemands;
    fulfillDemand():
      | IHaveManyCandidatesWhoAreReadyToAssignButNoneOfFriendsCanFulfillMoreDemandsAndNoneOfFriendsCanFulfillMoreDemands
      | IHaveManyCandidatesWhoCanFulfillDemandsButNoneOfFriendsCanFulfillMoreDemandsAndNoneOfFriendsCanFulfillMoreDemands;
  };

type IHaveManyCandidatesWhoCanFulfillDemandsButNoneOfFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable =
  {
    revokeLastCandidate(): NextStateRevokingCandidateWhenOtherCanFulfillDemands;
    fulfillDemand():
      | IHaveManyCandidatesWhoAreReadyToAssignButNoneOfFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable
      | IHaveManyCandidatesWhoCanFulfillDemandsButNoneOfFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable;
    nextCandidate(): NextStateSelectingCandidate;
    previousCandidate(): NextStateSelectingCandidate;
  };

type IHaveManyCandidatesWhoCanFulfillDemandsAndSomeFriendsCanFulfillMoreDemandsButNoneOfFriendsCanFulfillMoreDemands =
  {
    revokeLastCandidate(): NextStateRevokingCandidateWhenOtherCanFulfillDemands;
    fulfillDemand():
      | IHaveManyCandidatesWhoAreReadyToAssignAndSomeFriendsCanFulfillMoreDemandsButNoneOtherFriendsAvailable
      | IHaveManyCandidatesWhoCanFulfillDemandsAndSomeFriendsCanFulfillMoreDemandsButNoneOfFriendsCanFulfillMoreDemands;
    addCandidate(): NextStateAddingCandidateWhenOtherCanFulfillDemands;
  };

type IHaveManyCandidatesWhoCanFulfillDemandsAndSomeFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable =
  {
    revokeLastCandidate(): NextStateRevokingCandidateWhenOtherCanFulfillDemands;
    fulfillDemand():
      | IHaveManyCandidatesWhoAreReadyToAssignAndSomeFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable
      | IHaveManyCandidatesWhoCanFulfillDemandsAndSomeFriendsCanFulfillMoreDemandsAndOtherFriendsAreAvailable;
    addCandidate(): NextStateAddingCandidateWhenOtherCanFulfillDemands;
    nextCandidate(): NextStateSelectingCandidate;
    previousCandidate(): NextStateSelectingCandidate;
  };

export type CandidateFulfills = Candidate<CandidateFulfillingDemand>;

export type FulfillDemand = {
  volunteer: Volunteer["id"];
  team: string;
};

export type FunnelRepositories = {
  assignments: Assignments;
  candidateFactory: CandidateFactory;
};

export type ActiveFunnelInitializer<
  Candidates extends Candidate[] = Candidate[],
> = [Candidates, FunnelRepositories, Assignment];

export const ONE_ITEM = 1;

export abstract class ActiveFunnel<C extends IDefineCandidate>
  implements IamActiveFunnel<C>
{
  protected constructor(
    protected readonly _candidates: Candidate<C>[],
    protected readonly repositories: FunnelRepositories,
    protected readonly assignment: Assignment,
  ) {}

  get hasRemainingDemands(): boolean {
    const { demands, assignees } = this.assignment;
    const totalDemands = demands.reduce(
      (sum, { demand: count }) => sum + count,
      0,
    );
    const totalAssignees = assignees.length;
    return this._candidates.length < totalDemands - totalAssignees;
  }

  get candidates(): C[] {
    return this._candidates.map((candidate) => candidate.json);
  }
}

export abstract class EveryCandidateFulfillsDemand
  extends ActiveFunnel<CandidateFulfillingDemand>
  implements IAmReadyToAssign
{
  protected constructor(
    initializer: ActiveFunnelInitializer<CandidateFulfills[]>,
  ) {
    super(...initializer);
  }

  async assign(): Promise<Assignment> {
    const { taskId, mobilizationId, assignmentId } = this.assignment;
    const assignment = { taskId, mobilizationId, assignmentId };
    const volunteers = this.candidates.map(Candidate.toAssignment);

    return this.repositories.assignments.assign({ assignment, volunteers });
  }
}

export function areEveryCandidateFulfillingDemand(
  candidates: Candidate[],
): candidates is CandidateFulfills[] {
  return candidates.every((candidate) => isFulfillingDemand(candidate.json));
}
