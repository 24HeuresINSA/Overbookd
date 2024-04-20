import { BENEVOLE_CODE } from "@overbookd/team";
import { beforeAll, describe, expect, it } from "vitest";
import {
  EveryCandidateFulfillsDemand,
  Setup,
  VolunteerSelected,
} from "./assign-volunteers-funnel";
import { InMemoryPlanning } from "./planning.inmemory";
import { InMemoryAssignments } from "./assignments.inmemory";
import {
  noel,
  lea,
  benevolant,
  rendreKangoo,
  ontaine,
  tatouin,
  couperDesCarottes,
} from "./assign-volunteers-funnel.test-utils";
import { CandidateFactory, isFulfillingDemand } from "./candidate";

describe("Assign volunteers funnel", () => {
  const planning = new InMemoryPlanning(
    new Map([
      [noel.volunteer.id, noel.planning],
      [lea.volunteer.id, lea.planning],
      [ontaine.volunteer.id, ontaine.planning],
      [tatouin.volunteer.id, tatouin.planning],
    ]),
  );
  const initialAssignments = [benevolant, rendreKangoo, couperDesCarottes];
  const candidateFactory = new CandidateFactory(planning);
  describe("when assignment has only one team member needs remaining", () => {
    describe.each`
      volunteerName                  | volunteer            | taskName                  | task                 | team             | candidates             | planning
      ${noel.volunteer.firstname}    | ${noel.volunteer}    | ${benevolant.name}        | ${benevolant}        | ${BENEVOLE_CODE} | ${[noel.volunteer]}    | ${noel.planning}
      ${lea.volunteer.firstname}     | ${lea.volunteer}     | ${benevolant.name}        | ${benevolant}        | ${BENEVOLE_CODE} | ${[lea.volunteer]}     | ${lea.planning}
      ${ontaine.volunteer.firstname} | ${ontaine.volunteer} | ${couperDesCarottes.name} | ${couperDesCarottes} | ${"catering"}    | ${[ontaine.volunteer]} | ${ontaine.planning}
    `(
      "when selecting $volunteerName as available volunteer on task $taskName",
      ({ volunteer, candidates, planning, task, team }) => {
        let everyCandidateFulfillsDemand: EveryCandidateFulfillsDemand;
        beforeAll(async () => {
          const assignments = new InMemoryAssignments(initialAssignments);
          const funnel = Setup.init(candidateFactory, assignments, task);
          const selected = await funnel.select(volunteer);
          if (!isEveryCandidateFulfillsDemand(selected)) {
            throw new Error("Unexepected funnel type");
          }
          everyCandidateFulfillsDemand = selected;
        });
        it("should expose him as a candidate", () => {
          expect(everyCandidateFulfillsDemand.candidates).toMatchObject(
            candidates,
          );
        });
        it("should select benevole as team assignment", () => {
          expect(
            everyCandidateFulfillsDemand.candidates.every(
              (candidate) => candidate.as === team,
            ),
          ).toBe(true);
        });
        it("should expose his planning", () => {
          expect(
            everyCandidateFulfillsDemand.candidates.at(0)?.planning,
          ).toStrictEqual(planning);
        });
        it("should indicate there is not remaining team demanded", () => {
          expect(everyCandidateFulfillsDemand.hasRemainingDemands).toBe(false);
        });
        describe("when assigning selected volunteers", () => {
          it("should save new assignments", async () => {
            const expectedAssignees = [
              ...task.assignees,
              { volunteer: volunteer.id, as: team },
            ];
            const assignment = await everyCandidateFulfillsDemand.assign();

            expect(assignment).toEqual({
              ...task,
              assignees: expectedAssignees,
            });
          });
        });
      },
    );
  });
  describe("when assignment needs two benevoles and one conducteur", () => {
    describe("when selected volunteer is only member of benevole", () => {
      let funnel: EveryCandidateFulfillsDemand;
      beforeAll(async () => {
        const assignments = new InMemoryAssignments(initialAssignments);
        const volunteerSelected = await Setup.init(
          candidateFactory,
          assignments,
          rendreKangoo,
        ).select(noel.volunteer);
        if (!isEveryCandidateFulfillsDemand(volunteerSelected)) {
          throw new Error("Unexepected funnel type");
        }
        funnel = volunteerSelected;
      });
      it("should select benevole as team assignment", () => {
        const [noelCandidate, ..._candidates] = funnel.candidates;
        expect(noelCandidate.as).toBe(BENEVOLE_CODE);
      });
      it("should indicate there is remaining team demanded", () => {
        expect(funnel.hasRemainingDemands).toBe(true);
      });
      describe("when assigning selected volunteers", () => {
        it("should save new assignments", async () => {
          const expectedAssignees = [
            ...rendreKangoo.assignees,
            { volunteer: noel.volunteer.id, as: BENEVOLE_CODE },
          ];
          const assignment = await funnel.assign();

          expect(assignment).toEqual({
            ...rendreKangoo,
            assignees: expectedAssignees,
          });
        });
      });
    });
    describe("when selected volunteer is member of both benevole and conducteur", () => {
      let volunteerFunnel: VolunteerSelected;
      const volunteer = lea.volunteer;
      beforeAll(async () => {
        const assignments = new InMemoryAssignments(initialAssignments);
        const funnel = await Setup.init(
          candidateFactory,
          assignments,
          rendreKangoo,
        ).select(volunteer);
        if (isEveryCandidateFulfillsDemand(funnel)) {
          throw new Error("Unexepected funnel type");
        }
        volunteerFunnel = funnel;
      });
      it("should NOT select team assignment", () => {
        const [candidate, ..._candidates] = volunteerFunnel.candidates;
        expect(candidate.as).toBeUndefined();
      });
      it("should indicate there is remaining team demanded", () => {
        expect(volunteerFunnel.hasRemainingDemands).toBe(true);
      });
      describe.each`
        team
        ${BENEVOLE_CODE}
        ${"conducteur"}
      `(
        "when defininig $team assignment for selected volunteer",
        ({ team }) => {
          let withAssignmentFunnel: EveryCandidateFulfillsDemand;
          beforeAll(() => {
            const definition = { volunteer: volunteer.id, team };
            const funnel = volunteerFunnel.fulfillDemand(definition);
            if (!isEveryCandidateFulfillsDemand(funnel)) {
              throw new Error("Unexepected funnel type");
            }
            withAssignmentFunnel = funnel;
          });

          it(`should select ${team} as team assignment`, () => {
            const [candidate, ..._candidates] = withAssignmentFunnel.candidates;
            expect(candidate.as).toBe(team);
          });
          describe("when assigning selected volunteers", () => {
            it("should save new assignments", async () => {
              const expectedAssignees = [
                ...rendreKangoo.assignees,
                { volunteer: volunteer.id, as: team },
              ];
              const assignment = await withAssignmentFunnel.assign();

              expect(assignment).toEqual({
                ...rendreKangoo,
                assignees: expectedAssignees,
              });
            });
          });
        },
      );
    });
  });
});

function isEveryCandidateFulfillsDemand(
  state: VolunteerSelected | EveryCandidateFulfillsDemand,
): state is EveryCandidateFulfillsDemand {
  return state.candidates.every(isFulfillingDemand);
}
