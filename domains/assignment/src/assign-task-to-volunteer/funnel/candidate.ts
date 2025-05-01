import { IProvidePeriod } from "@overbookd/time";
import {
  Assignment,
  isMemberOf,
  TeamDemanded,
  TeamMember,
} from "../assignment.js";
import {
  Availabilities,
  BreakPeriods,
  Friends,
  Planning,
  PlanningEvent,
} from "./planning.js";
import { AssignableVolunteer } from "../assignable-volunteer.js";
import { retrieveImplicitTeams } from "../../candidate-teams.js";

type NotYetFulfillingDemandCandidate = AssignableVolunteer & {
  friends: AssignableVolunteer[];
  planning: PlanningEvent[];
  availabilities: IProvidePeriod[];
  breakPeriods: IProvidePeriod[];
  assignableTeams: string[];
  as: undefined;
};

export type CandidateFulfillingDemand = AssignableVolunteer & {
  friends: AssignableVolunteer[];
  planning: PlanningEvent[];
  availabilities: IProvidePeriod[];
  breakPeriods: IProvidePeriod[];
  assignableTeams: string[];
  as: string;
};

export type IDefineCandidate =
  | NotYetFulfillingDemandCandidate
  | CandidateFulfillingDemand;

type Agenda = {
  planning: PlanningEvent[];
  availabilities: IProvidePeriod[];
  breakPeriods: IProvidePeriod[];
};

type RelationShip = {
  volunteer: AssignableVolunteer;
  friends: AssignableVolunteer[];
};

export class Candidate<T extends IDefineCandidate = IDefineCandidate> {
  private constructor(private readonly candidate: T) {}

  static init(
    { volunteer, friends }: RelationShip,
    { planning, availabilities, breakPeriods }: Agenda,
    assignment: Assignment,
  ) {
    const assignableTeams = Candidate.getAssignableTeams(
      assignment,
      volunteer.teams,
    );
    const as = assignableTeams.length === 1 ? assignableTeams.at(0) : undefined;

    return new Candidate({
      ...volunteer,
      friends,
      planning,
      availabilities,
      as,
      assignableTeams,
      breakPeriods,
    });
  }

  static from<T extends IDefineCandidate>(candidate: T) {
    return new Candidate<T>(candidate);
  }

  static getAssignableTeams(
    { demands, assignees }: Assignment,
    teams: string[],
  ) {
    const remainingDemands = demands.reduce(
      (remainingDemands: TeamDemanded[], { team, demand }) => {
        const totalAssignees = assignees.filter(isMemberOf(team)).length;
        if (totalAssignees === demand) return remainingDemands;

        return [...remainingDemands, { team, demand: demand - totalAssignees }];
      },
      [],
    );
    return assignableTeamsAccordingToRemainingDemands(teams, remainingDemands);
  }

  static toAssignment({ id, as }: CandidateFulfillingDemand): TeamMember {
    return { id, as };
  }

  demandAs(as: string) {
    if (!this.candidate.assignableTeams.includes(as)) {
      throw new Error(`${this.name} is not team member of ${as}`);
    }
    return new Candidate<CandidateFulfillingDemand>({ ...this.candidate, as });
  }

  assignableTeamsAccordingTo(remainingDemands: TeamDemanded[]): string[] {
    const { teams } = this.candidate;
    return assignableTeamsAccordingToRemainingDemands(teams, remainingDemands);
  }

  private get name(): string {
    return `${this.candidate.firstname} ${this.candidate.lastname}`;
  }

  get json(): T {
    return this.candidate;
  }
}

function assignableTeamsAccordingToRemainingDemands(
  teams: string[],
  remainingDemands: TeamDemanded[],
) {
  const implicitTeams = retrieveImplicitTeams(teams);
  return implicitTeams.filter((team) =>
    remainingDemands.map(({ team }) => team).includes(team),
  );
}

export function isFulfillingDemand(
  candidate: IDefineCandidate,
): candidate is CandidateFulfillingDemand {
  return candidate.as !== undefined;
}

type Agendas = {
  planning: Planning;
  availabilities: Availabilities;
  breakPeriods: BreakPeriods;
};

export class CandidateFactory {
  constructor(
    private readonly agendas: Agendas,
    private readonly friends: Friends,
  ) {}

  async from(
    volunteer: AssignableVolunteer,
    assignment: Assignment,
  ): Promise<Candidate> {
    const { start, end } = assignment;
    const [planning, availabilities, breakPeriods, friends] = await Promise.all(
      [
        this.agendas.planning.for(volunteer.id),
        this.agendas.availabilities.for(volunteer.id),
        this.agendas.breakPeriods.for(volunteer.id),
        this.friends.availableDuringWith({ start, end }, volunteer.id),
      ],
    );

    const agenda = { planning, availabilities, breakPeriods };
    const relationShip = { volunteer, friends };
    return Candidate.init(relationShip, agenda, assignment);
  }
}
