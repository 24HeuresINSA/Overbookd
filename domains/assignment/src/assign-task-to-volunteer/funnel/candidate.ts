import { HARD, VIEUX, CONFIANCE } from "./teams";
import { TeamDemanded, Assignee, Assignment } from "./assignments";
import { Planning, PlanningEvent } from "./planning";
import { Volunteer } from "./volunteer";

type NotYetFulfillingDemandCandidate = Volunteer & {
  planning: PlanningEvent[];
  assignableTeams: string[];
  as: undefined;
};

export type CandidateFulfillingDemand = Volunteer & {
  planning: PlanningEvent[];
  assignableTeams: string[];
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
    assignment: Assignment,
  ) {
    const assignableTeams = Candidate.getAssignableTeams(
      assignment,
      volunteer.teams,
    );
    const as = assignableTeams.length === 1 ? assignableTeams.at(0) : undefined;

    return new Candidate({ ...volunteer, planning, as, assignableTeams });
  }

  private static getAssignableTeams(
    { demands, assignees }: Assignment,
    teams: string[],
  ) {
    const remainingDemands = demands.reduce(
      (remainingDemands, { team, count }) => {
        const totalAssignees = assignees.filter(({ as }) => as === team).length;
        if (totalAssignees === count) return remainingDemands;

        return [...remainingDemands, { team, count: count - totalAssignees }];
      },
      [] as TeamDemanded[],
    );
    const implicitTeams = retrieveImplicitTeams(teams);
    return implicitTeams.filter((team) =>
      remainingDemands.map(({ team }) => team).includes(team),
    );
  }

  static toAssignment({ id, as }: CandidateFulfillingDemand): Assignee {
    return { volunteer: id, as };
  }

  demandAs(as: string) {
    if (!this.candidate.assignableTeams.includes(as)) {
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

function retrieveImplicitTeams(teams: string[]) {
  const areConfianceByDefault = [HARD, VIEUX];
  const isConfiance = teams.some((team) =>
    areConfianceByDefault.includes(team),
  );

  return isConfiance ? [...teams, CONFIANCE] : teams;
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

    return Candidate.init(volunteer, planning, assignment);
  }
}
