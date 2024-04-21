import { IProvidePeriod } from "@overbookd/period";
import { HARD, VIEUX, CONFIANCE } from "../../teams";
import { Assignee, Assignment, TeamDemanded } from "../assignment";
import { Availabilities, Planning, PlanningEvent } from "./planning";
import { Volunteer } from "./volunteer";

type NotYetFulfillingDemandCandidate = Volunteer & {
  planning: PlanningEvent[];
  availabilities: IProvidePeriod[];
  assignableTeams: string[];
  as: undefined;
};

export type CandidateFulfillingDemand = Volunteer & {
  planning: PlanningEvent[];
  availabilities: IProvidePeriod[];
  assignableTeams: string[];
  as: string;
};

export type IDefineCandidate =
  | NotYetFulfillingDemandCandidate
  | CandidateFulfillingDemand;

type Agenda = {
  planning: PlanningEvent[];
  availabilities: IProvidePeriod[];
};

export class Candidate {
  private constructor(private readonly candidate: IDefineCandidate) {}

  static init(
    volunteer: Volunteer,
    { planning, availabilities }: Agenda,
    assignment: Assignment,
  ) {
    const assignableTeams = Candidate.getAssignableTeams(
      assignment,
      volunteer.teams,
    );
    const as = assignableTeams.length === 1 ? assignableTeams.at(0) : undefined;

    return new Candidate({
      ...volunteer,
      planning,
      availabilities,
      as,
      assignableTeams,
    });
  }

  private static getAssignableTeams(
    { demands, assignees }: Assignment,
    teams: string[],
  ) {
    const remainingDemands = demands.reduce(
      (remainingDemands: TeamDemanded[], { team, demand }) => {
        const totalAssignees = assignees.filter(({ as }) => as === team).length;
        if (totalAssignees === demand) return remainingDemands;

        return [...remainingDemands, { team, demand: demand - totalAssignees }];
      },
      [],
    );
    const implicitTeams = retrieveImplicitTeams(teams);
    return implicitTeams.filter((team) =>
      remainingDemands.map(({ team }) => team).includes(team),
    );
  }

  static toAssignment({ id, as }: CandidateFulfillingDemand): Assignee {
    return { id, as };
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
  constructor(
    private readonly planning: Planning,
    private readonly availabilities: Availabilities,
  ) {}

  async from(volunteer: Volunteer, assignment: Assignment): Promise<Candidate> {
    const [planning, availabilities] = await Promise.all([
      this.planning.for(volunteer.id),
      this.availabilities.for(volunteer.id),
    ]);

    return Candidate.init(volunteer, { planning, availabilities }, assignment);
  }
}
