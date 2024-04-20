import { TeamDemanded, Assignee, Assignment } from "./assignments";
import { Planning, PlanningEvent } from "./planning";
import { Volunteer } from "./volunteer";

type NotYetFulfillingDemandCandidate = Volunteer & {
  planning: PlanningEvent[];
  as: undefined;
};

export type CandidateFulfillingDemand = Volunteer & {
  planning: PlanningEvent[];
  as: string;
};

export type IDefineCandidate =
  | NotYetFulfillingDemandCandidate
  | CandidateFulfillingDemand;

export class Candidate {
  private constructor(private readonly candidate: IDefineCandidate) {}

  static init(
    volunteer: Volunteer,
    planning: PlanningEvent[],
    demands: TeamDemanded[],
  ) {
    const assignableTeams = volunteer.teams.filter((team) =>
      demands.map(({ team }) => team).includes(team),
    );
    const as = assignableTeams.length === 1 ? assignableTeams.at(0) : undefined;

    return new Candidate({ ...volunteer, planning, as });
  }

  static toAssignment({ id, as }: CandidateFulfillingDemand): Assignee {
    return { volunteer: id, as };
  }

  demandAs(as: string) {
    if (!this.candidate.teams.includes(as)) {
      throw new Error(`${this.name} is not team member of ${as}`);
    }
    return new Candidate({ ...this.candidate, as });
  }

  private get name(): string {
    return `${this.candidate.firstname} ${this.candidate.lastname}`;
  }

  get json(): IDefineCandidate {
    return this.candidate;
  }
}

export function isFulfillingDemand(
  candidate: IDefineCandidate,
): candidate is CandidateFulfillingDemand {
  return candidate.as !== undefined;
}

export class CandidateFactory {
  constructor(private readonly planning: Planning) {}

  async from(volunteer: Volunteer, assignment: Assignment): Promise<Candidate> {
    const planning = await this.planning.for(volunteer.id);

    return Candidate.init(volunteer, planning, assignment.demands);
  }
}
