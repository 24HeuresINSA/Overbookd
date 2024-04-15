import { IProvidePeriod } from "@overbookd/period";
import { BENEVOLE_CODE } from "@overbookd/team";
import { beforeAll, describe, expect, it } from "vitest";

type Volunteer = {
  id: number;
  firstname: string;
  lastname: string;
  teams: string[];
};

type PlanningEvent = IProvidePeriod & {
  task: string;
};

type Candidate = Volunteer & {
  planning: PlanningEvent[];
  as?: string;
};

const friday08hTo09h = {
  start: new Date("2024-17-05T08:00+02:00"),
  end: new Date("2024-17-05T09:00+02:00"),
};

const noel = {
  volunteer: {
    id: 1,
    firstname: "Noel",
    lastname: "Ertsemud",
    teams: [BENEVOLE_CODE, "vieux"],
  },
  planning: [{ ...friday08hTo09h, task: "Accueillir INSA CVL" }],
};
const lea = {
  volunteer: {
    id: 2,
    firstname: "Lea",
    lastname: "Mauyno",
    teams: [BENEVOLE_CODE, "vieux", "conducteur"],
  },
  planning: [],
};

type TeamDemanded = { team: string; count: number };

type Assignment = {
  id: number;
  name: string;
  demands: TeamDemanded[];
};

const benevolant: Assignment = {
  id: 1,
  name: "Benevolant",
  demands: [{ team: BENEVOLE_CODE, count: 1 }],
};

const rendreKangoo: Assignment = {
  id: 2,
  name: "Rendre les Kangoos",
  demands: [
    { team: "conducteur", count: 1 },
    { team: BENEVOLE_CODE, count: 2 },
  ],
};

class AssignFunnelSetup {
  private constructor(
    private readonly candidateFactory: CandidateFactory,
    private readonly assignment: Assignment,
  ) {}

  static init(candidateFactory: CandidateFactory, assignment: Assignment) {
    return new AssignFunnelSetup(candidateFactory, assignment);
  }

  async select(volunteer: Volunteer) {
    const candidate = await this.candidateFactory.from(
      volunteer,
      this.assignment,
    );
    return AssignFunnelVolunteerSelected.init(candidate);
  }
}

class AssignFunnelVolunteerSelected {
  private constructor(readonly candidates: Candidate[]) {}

  static init(candidate: Candidate) {
    return new AssignFunnelVolunteerSelected([candidate]);
  }
}

type Planning = {
  for(volunteer: Volunteer["id"]): Promise<PlanningEvent[]>;
};

class InMemoryPlanning implements Planning {
  constructor(private plannings: Map<Volunteer["id"], PlanningEvent[]>) {}

  for(volunteer: Volunteer["id"]): Promise<PlanningEvent[]> {
    return Promise.resolve(this.plannings.get(volunteer) ?? []);
  }
}

class CandidateFactory {
  constructor(private readonly planning: Planning) {}

  async from(volunteer: Volunteer, assignment: Assignment): Promise<Candidate> {
    const planning = await this.planning.for(volunteer.id);

    const assignableTeams = volunteer.teams.filter((team) =>
      assignment.demands.map(({ team }) => team).includes(team),
    );
    const as = assignableTeams.length === 1 ? assignableTeams.at(0) : undefined;

    return { ...volunteer, planning, as };
  }
}

describe("Assign volunteers funnel", () => {
  const planning = new InMemoryPlanning(
    new Map([
      [noel.volunteer.id, noel.planning],
      [lea.volunteer.id, lea.planning],
    ]),
  );
  const candidateFactory = new CandidateFactory(planning);
  describe("when assignment as only one benevole needs remaining", () => {
    const funnel = AssignFunnelSetup.init(candidateFactory, benevolant);
    describe.each`
      volunteer         | candidates          | planning
      ${noel.volunteer} | ${[noel.volunteer]} | ${noel.planning}
      ${lea.volunteer}  | ${[lea.volunteer]}  | ${lea.planning}
    `(
      "when selecting an available volunteer",
      ({ volunteer, candidates, planning }) => {
        let volunteerSelected: AssignFunnelVolunteerSelected;
        beforeAll(async () => {
          volunteerSelected = await funnel.select(volunteer);
        });
        it("should expose him as a candidate", () => {
          expect(volunteerSelected.candidates).toMatchObject(candidates);
        });
        it("should select benevole as team assignment", () => {
          expect(
            volunteerSelected.candidates.every(
              (candidate) => candidate.as === BENEVOLE_CODE,
            ),
          ).toBe(true);
        });
        it("should expose his planning", () => {
          expect(volunteerSelected.candidates.at(0)?.planning).toStrictEqual(
            planning,
          );
        });
      },
    );
  });
  describe("when assignment needs two benevoles and one conducteur", () => {
    describe("when selected volunteer is only member of benevole", () => {
      it("should select benevole as team assignment", async () => {
        const funnel = await AssignFunnelSetup.init(
          candidateFactory,
          rendreKangoo,
        ).select(noel.volunteer);

        const [noelCandidate, ..._candidates] = funnel.candidates;
        expect(noelCandidate.as).toBe(BENEVOLE_CODE);
      });
    });
    describe("when selected volunteer is member of both benevole and conducteur", () => {
      it("should NOT select team assignment", async () => {
        const funnel = await AssignFunnelSetup.init(
          candidateFactory,
          rendreKangoo,
        ).select(lea.volunteer);

        const [leaCandidate, ..._candidates] = funnel.candidates;
        expect(leaCandidate.as).toBeUndefined();
      });
    });
  });
});
