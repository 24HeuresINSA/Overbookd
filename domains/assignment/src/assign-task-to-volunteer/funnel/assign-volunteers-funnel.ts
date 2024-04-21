import {
  Candidate,
  IDefineCandidate,
  CandidateFulfillingDemand,
  isFulfillingDemand,
  CandidateFactory,
} from "./candidate";
import { Volunteer } from "./volunteer";
import { Assignments } from "./assignments";
import { Assignment } from "../assignment";

export class Setup {
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
    return new Setup(candidateFactory, assignments, assignment);
  }

  async select(volunteer: Volunteer) {
    const candidate = await this.candidateFactory.from(
      volunteer,
      this.assignment,
    );
    return VolunteerSelected.init(candidate, this.assignments, this.assignment);
  }
}

type FulfillDemand = {
  volunteer: Volunteer["id"];
  team: string;
};

export class VolunteerSelected {
  private constructor(
    private readonly _candidates: Candidate[],
    private readonly assignments: Assignments,
    private readonly assignment: Assignment,
  ) {}

  static init(
    candidate: Candidate,
    assignments: Assignments,
    assignment: Assignment,
  ) {
    if (isFulfillingDemand(candidate.json)) {
      return EveryCandidateFulfillsDemand.init(
        [candidate],
        assignments,
        assignment,
      );
    }
    return new VolunteerSelected([candidate], assignments, assignment);
  }

  fulfillDemand({ volunteer, team }: FulfillDemand) {
    const candidates = this._candidates.map((candidate) =>
      candidate.json.id === volunteer ? candidate.demandAs(team) : candidate,
    );
    if (candidates.every((candidate) => isFulfillingDemand(candidate.json))) {
      return EveryCandidateFulfillsDemand.init(
        candidates,
        this.assignments,
        this.assignment,
      );
    }
    return new VolunteerSelected(candidates, this.assignments, this.assignment);
  }

  get hasRemainingDemands(): boolean {
    const { demands } = this.assignment;
    const totalDemands = demands.reduce(
      (sum, { demand: count }) => sum + count,
      0,
    );
    return this._candidates.length < totalDemands;
  }

  get candidates(): IDefineCandidate[] {
    return this._candidates.map((candidate) => candidate.json);
  }
}

export class EveryCandidateFulfillsDemand {
  private constructor(
    readonly candidates: CandidateFulfillingDemand[],
    private readonly assignments: Assignments,
    private readonly assignment: Assignment,
  ) {}

  static init(
    candidates: Candidate[],
    assignments: Assignments,
    assignment: Assignment,
  ) {
    const candidateJson = candidates.map((c) => c.json);
    if (!candidateJson.every(isFulfillingDemand)) {
      throw new Error("Not fulfilling demands");
    }
    return new EveryCandidateFulfillsDemand(
      candidateJson,
      assignments,
      assignment,
    );
  }

  async assign(): Promise<Assignment> {
    const { taskId, mobilizationId, assignmentId } = this.assignment;
    const assignment = { taskId, mobilizationId, assignmentId };
    const volunteers = this.candidates.map(Candidate.toAssignment);

    return this.assignments.assign({ assignment, volunteers });
  }

  get hasRemainingDemands(): boolean {
    const { demands, assignees } = this.assignment;
    const totalDemands = demands.reduce(
      (sum, { demand: count }) => sum + count,
      0,
    );
    const totalAssignees = assignees.length;
    return this.candidates.length < totalDemands - totalAssignees;
  }
}

export function isEveryCandidateFulfillsDemand(
  state: VolunteerSelected | EveryCandidateFulfillsDemand,
): state is EveryCandidateFulfillsDemand {
  return state.candidates.every(isFulfillingDemand);
}
