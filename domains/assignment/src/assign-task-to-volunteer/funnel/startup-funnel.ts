import { Assignment } from "../assignment.js";
import { Assignments } from "../repositories/assignments.js";
import { CandidateFactory, IDefineCandidate } from "./candidate.js";
import { IActAsFunnel, FunnelError, FunnelRepositories } from "./funnel.js";
import { AssignVolunteerFunnel } from "./assign-volunteer-funnel.js";
import { AssignableVolunteer } from "../assignable-volunteer.js";

abstract class InactiveFunnel implements IActAsFunnel {
  candidates: IDefineCandidate[] = [];
  canAssign: boolean = false;
  assign(): Promise<ReadyToStart> {
    return Promise.reject(
      new FunnelError("Impossible d'affecter pour le moment"),
    );
  }
  canFulfillMoreRemainingDemands: boolean = false;
  addCandidate(): Promise<IActAsFunnel> {
    return Promise.resolve(this);
  }
  fulfillDemand(): IActAsFunnel {
    return this;
  }
  canRevokeLastCandidate: boolean = false;
  revokeLastCandidate(): IActAsFunnel {
    return this;
  }
  canChangeLastCandidate: boolean = false;
  previousCandidate(): Promise<IActAsFunnel> {
    return Promise.resolve(this);
  }
  nextCandidate(): Promise<IActAsFunnel> {
    return Promise.resolve(this);
  }
}

export class ReadyToStart extends InactiveFunnel {
  private constructor(
    private readonly candidateFactory: CandidateFactory,
    private readonly assignments: Assignments,
  ) {
    super();
  }

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

export class WaitingForVolunteer extends InactiveFunnel {
  private constructor(
    private readonly candidateFactory: CandidateFactory,
    private readonly assignments: Assignments,
    private readonly assignment: Assignment,
  ) {
    super();
  }

  static init(
    candidateFactory: CandidateFactory,
    assignments: Assignments,
    assignment: Assignment,
  ) {
    return new WaitingForVolunteer(candidateFactory, assignments, assignment);
  }

  async select(volunteer: AssignableVolunteer) {
    const candidate = await this.candidateFactory.from(
      volunteer,
      this.assignment,
    );
    const repositories: FunnelRepositories = {
      assignments: this.assignments,
      candidateFactory: this.candidateFactory,
    };
    return AssignVolunteerFunnel.init([
      [candidate],
      repositories,
      this.assignment,
    ]);
  }
}
