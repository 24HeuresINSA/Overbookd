import {
  Candidate,
  IDefineCandidate,
  CandidateFulfillingDemand,
  isFulfillingDemand,
  CandidateFactory,
} from "./candidate";
import { Volunteer } from "./volunteer";
import { Assignments } from "../repositories/assignments";
import { Assignment } from "../assignment";

/*
State Machin
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

type IamActiveFunnel<C extends IDefineCandidate> = {
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

type IHaveOnlyOneCandidateWhoIsReadyToAssignButNoneOfFriendsCanFulfillMoreDemands =
  IAmReadyToAssign;

type IHaveOnlyOneCandidateWhoCanFulfillDemandsAndSomeFriendsCanFulfillMoreDemands =
  {
    fulfillDemand(
      volunteer: FulfillDemand,
    ): IHaveOnlyOneCandidateWhoIsReadyToAssignAndSomeFriendsCanFulfillMoreDemands;
    addCandidate(): NextStateAddingCandidateWhenOtherCanFulfillDemands;
  };

type IHaveOnlyOneCandidateWhoCanFulfillDemandsButNoneOfFriendsCanFulfillMoreDemands =
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

export class ReadyToStart {
  private constructor(
    private readonly candidateFactory: CandidateFactory,
    private readonly assignments: Assignments,
  ) {}

  static init(candidateFactory: CandidateFactory, assignments: Assignments) {
    return new ReadyToStart(candidateFactory, assignments);
  }

  select(assignment: Assignment) {
    return WaitingForVolunteer.init(
      this.candidateFactory,
      this.assignments,
      assignment,
    );
  }
}

export class WaitingForVolunteer {
  private constructor(
    private readonly candidateFactory: CandidateFactory,
    private readonly assignments: Assignments,
    private readonly assignment: Assignment,
  ) {}

  static init(
    candidateFactory: CandidateFactory,
    assignments: Assignments,
    assignment: Assignment,
  ) {
    return new WaitingForVolunteer(candidateFactory, assignments, assignment);
  }

  async select(volunteer: Volunteer) {
    const candidate = await this.candidateFactory.from(
      volunteer,
      this.assignment,
    );
    const repositories: FunnelRepositories = {
      assignments: this.assignments,
      candidateFactory: this.candidateFactory,
    };
    return OneCandidateNotFulfillingDemand.init([
      [candidate],
      repositories,
      this.assignment,
    ]);
  }
}

type CandidateFulfills = Candidate<CandidateFulfillingDemand>;

type FulfillDemand = {
  volunteer: Volunteer["id"];
  team: string;
};

type FunnelRepositories = {
  assignments: Assignments;
  candidateFactory: CandidateFactory;
};

type ActiveFunnelInitializer<Candidates extends Candidate[] = Candidate[]> = [
  Candidates,
  FunnelRepositories,
  Assignment,
];

const ONE_ITEM = 1;

abstract class ActiveFunnel<C extends IDefineCandidate>
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

abstract class EveryCandidateFulfillsDemand
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

export class OneCandidateNotFulfillingDemand
  extends ActiveFunnel<IDefineCandidate>
  implements
    IHaveOnlyOneCandidateWhoCanFulfillDemandsButNoneOfFriendsCanFulfillMoreDemands,
    IamActiveFunnel<IDefineCandidate>
{
  private constructor(initializer: ActiveFunnelInitializer<[Candidate]>) {
    super(...initializer);
  }

  static init(initializer: ActiveFunnelInitializer<[Candidate]>) {
    if (OneCandidateFulfillsDemand.isSatisfiedBy(initializer)) {
      return OneCandidateFulfillsDemand.init(initializer);
    }
    return new OneCandidateNotFulfillingDemand(initializer);
  }

  fulfillDemand({ volunteer, team }: FulfillDemand) {
    const current = this._candidates.find(
      (candidate) => candidate.json.id === volunteer,
    );
    if (!current) throw new Error("Wrong Volunteer");
    const fullFilling = current.demandAs(team);

    return OneCandidateFulfillsDemand.init([
      [fullFilling],
      this.repositories,
      this.assignment,
    ]);
  }

  static isSatisfiedBy(
    initializer: ActiveFunnelInitializer,
  ): initializer is ActiveFunnelInitializer<[Candidate]> {
    const [canidates] = initializer;
    return canidates.length === ONE_ITEM;
  }
}

export class OneCandidateFulfillsDemand
  extends EveryCandidateFulfillsDemand
  implements
    IHaveOnlyOneCandidateWhoIsReadyToAssignButNoneOfFriendsCanFulfillMoreDemands
{
  protected constructor(
    initializer: ActiveFunnelInitializer<[CandidateFulfills]>,
  ) {
    super(initializer);
  }

  static init(initializer: ActiveFunnelInitializer<[CandidateFulfills]>) {
    return new OneCandidateFulfillsDemand(initializer);
  }

  static isSatisfiedBy(
    initializer: ActiveFunnelInitializer,
  ): initializer is ActiveFunnelInitializer<[CandidateFulfills]> {
    const [candidates] = initializer;
    if (candidates.length > ONE_ITEM) return false;
    return areEveryCandidateFulfillingDemand(candidates);
  }
}

export type Funnel =
  | ReadyToStart
  | WaitingForVolunteer
  | OneCandidateNotFulfillingDemand
  | OneCandidateFulfillsDemand;

export function isReadyToStart(state: Funnel): state is ReadyToStart {
  return state instanceof ReadyToStart;
}

export function isWaitingForVolunteer(
  state: Funnel,
): state is WaitingForVolunteer {
  return state instanceof WaitingForVolunteer;
}

export function isOneCandidateNotFulfillingDemand(
  state: Funnel,
): state is OneCandidateNotFulfillingDemand {
  return state instanceof OneCandidateNotFulfillingDemand;
}

export function isOneCandidateFulfillsDemand(
  state: Funnel,
): state is OneCandidateFulfillsDemand {
  return state instanceof OneCandidateFulfillsDemand;
}

function areEveryCandidateFulfillingDemand(
  candidates: Candidate[],
): candidates is CandidateFulfills[] {
  return candidates.every((candidate) => isFulfillingDemand(candidate.json));
}
