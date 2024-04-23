import { Candidate, IDefineCandidate, CandidateFactory } from "./candidate";
import { Volunteer } from "./volunteer";
import { Assignments } from "../../common/repositories/assignments";
import { Assignment } from "../../common/assignment";
import {
  FunnelRepositories,
  IamActiveFunnel,
  ActiveFunnelInitializer,
  CandidateFulfills,
  IHaveOnlyOneCandidateWhoCanFulfillDemandsButNoneOfFriendsCanFulfillMoreDemands,
  FulfillDemand,
  ONE_ITEM,
  IHaveOnlyOneCandidateWhoIsReadyToAssignButNoneOfFriendsCanFulfillMoreDemands,
  areEveryCandidateFulfillingDemand,
  ActiveFunnel,
  EveryCandidateFulfillsDemand,
} from "./state-machine";

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
