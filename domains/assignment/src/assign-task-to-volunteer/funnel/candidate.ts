import { IProvidePeriod } from "@overbookd/period";
import { HARD, VIEUX, CONFIANCE } from "../../teams";
import {
  Assignment,
  isMemberOf,
  TeamDemanded,
  TeamMember,
} from "../assignment";
import { Availabilities, Friends, Planning, PlanningEvent } from "./planning";
import { AssignableVolunteer } from "../assignable-volunteer";

type NotYetFulfillingDemandCandidate = AssignableVolunteer & {
  friends: AssignableVolunteer[];
  planning: PlanningEvent[];
  availabilities: IProvidePeriod[];
  assignableTeams: string[];
  as: undefined;
};

export type CandidateFulfillingDemand = AssignableVolunteer & {
  friends: AssignableVolunteer[];
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

type RelationShip = {
  volunteer: AssignableVolunteer;
  friends: AssignableVolunteer[];
};

export class Candidate<T extends IDefineCandidate = IDefineCandidate> {
  private constructor(private readonly candidate: T) {}

  static init(
    { volunteer, friends }: RelationShip,
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
      friends,
      planning,
      availabilities,
      as,
      assignableTeams,
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
    const implicitTeams = retrieveImplicitTeams(teams);
    return implicitTeams.filter((team) =>
      remainingDemands.map(({ team }) => team).includes(team),
    );
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

  private get name(): string {
    return `${this.candidate.firstname} ${this.candidate.lastname}`;
  }

  get json(): T {
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
    private readonly friends: Friends,
  ) {}

  async from(
    volunteer: AssignableVolunteer,
    assignment: Assignment,
  ): Promise<Candidate> {
    const { start, end } = assignment;
    const [planning, availabilities, friends] = await Promise.all([
      this.planning.for(volunteer.id),
      this.availabilities.for(volunteer.id),
      this.friends.availableDuringWith({ start, end }, volunteer.id),
    ]);

    const agenda = { planning, availabilities };
    const relationShip = { volunteer, friends };
    return Candidate.init(relationShip, agenda, assignment);
  }
}
