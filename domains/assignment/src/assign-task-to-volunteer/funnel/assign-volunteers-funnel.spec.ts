import { beforeAll, describe, expect, it } from "vitest";
import { BENEVOLE_CODE } from "@overbookd/team";
import {
  EveryCandidateFulfillsDemand,
  WaitingForVolunteer,
  SomeCandidatesNotFulfillingDemand,
  isEveryCandidateFulfillsDemand,
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
  luce,
  gererLaCaisse,
  scannerLesBillets,
  demonterLesJeuxGonflables,
} from "./assign-volunteers-funnel.test-utils";
import { CandidateFactory } from "./candidate";
import { CONFIANCE, HARD, VIEUX } from "../../teams";
import { InMemoryAvailabilities } from "./availabilties.inmemory";

describe("Assign volunteers funnel", () => {
  const planning = new InMemoryPlanning(
    new Map([
      [noel.volunteer.id, noel.planning],
      [lea.volunteer.id, lea.planning],
      [ontaine.volunteer.id, ontaine.planning],
      [tatouin.volunteer.id, tatouin.planning],
      [luce.volunteer.id, luce.planning],
    ]),
  );
  const availabilities = new InMemoryAvailabilities(
    new Map([
      [noel.volunteer.id, noel.availabilities],
      [lea.volunteer.id, lea.availabilities],
      [ontaine.volunteer.id, ontaine.availabilities],
      [tatouin.volunteer.id, tatouin.availabilities],
      [luce.volunteer.id, luce.availabilities],
    ]),
  );
  const initialAssignments = [
    benevolant,
    rendreKangoo,
    couperDesCarottes,
    gererLaCaisse,
    demonterLesJeuxGonflables,
  ];
  const candidateFactory = new CandidateFactory(planning, availabilities);
  describe("when assignment has only one team member needs remaining", () => {
    describe.each`
      volunteerName                  | volunteer            | taskName                          | task                         | team             | candidates             | planning            | availabilities
      ${noel.volunteer.firstname}    | ${noel.volunteer}    | ${benevolant.name}                | ${benevolant}                | ${BENEVOLE_CODE} | ${[noel.volunteer]}    | ${noel.planning}    | ${noel.availabilities}
      ${lea.volunteer.firstname}     | ${lea.volunteer}     | ${benevolant.name}                | ${benevolant}                | ${BENEVOLE_CODE} | ${[lea.volunteer]}     | ${lea.planning}     | ${lea.availabilities}
      ${ontaine.volunteer.firstname} | ${ontaine.volunteer} | ${couperDesCarottes.name}         | ${couperDesCarottes}         | ${"catering"}    | ${[ontaine.volunteer]} | ${ontaine.planning} | ${ontaine.availabilities}
      ${noel.volunteer.firstname}    | ${noel.volunteer}    | ${demonterLesJeuxGonflables.name} | ${demonterLesJeuxGonflables} | ${BENEVOLE_CODE} | ${[noel.volunteer]}    | ${noel.planning}    | ${noel.availabilities}
    `(
      "when selecting $volunteerName as available volunteer on task $taskName",
      ({ volunteer, candidates, planning, task, team, availabilities }) => {
        let everyCandidateFulfillsDemand: EveryCandidateFulfillsDemand;
        beforeAll(async () => {
          const assignments = new InMemoryAssignments(initialAssignments);
          const funnel = WaitingForVolunteer.init(
            candidateFactory,
            assignments,
            task,
          );
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
        it("should expose his availabilities", () => {
          expect(
            everyCandidateFulfillsDemand.candidates.at(0)?.availabilities,
          ).toStrictEqual(availabilities);
        });
        it("should indicate there is not remaining team demanded", () => {
          expect(everyCandidateFulfillsDemand.hasRemainingDemands).toBe(false);
        });
        describe("when assigning selected volunteers", () => {
          it("should save new assignments", async () => {
            const expectedAssignees = [
              ...task.assignees,
              { id: volunteer.id, as: team },
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
        const volunteerSelected = await WaitingForVolunteer.init(
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
            { id: noel.volunteer.id, as: BENEVOLE_CODE },
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
      let volunteerFunnel: SomeCandidatesNotFulfillingDemand;
      const volunteer = lea.volunteer;
      beforeAll(async () => {
        const assignments = new InMemoryAssignments(initialAssignments);
        const funnel = await WaitingForVolunteer.init(
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
                { id: volunteer.id, as: team },
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
  describe("Assign hard and vieux as confiance", () => {
    describe("when assignment needs one more confiance", () => {
      describe.each`
        assignment       | volunteer         | team
        ${gererLaCaisse} | ${luce.volunteer} | ${HARD}
        ${gererLaCaisse} | ${lea.volunteer}  | ${VIEUX}
      `(
        "when volunteer selected is part of $team",
        ({ assignment, volunteer }) => {
          let funnel: WaitingForVolunteer;
          beforeAll(() => {
            const assignments = new InMemoryAssignments(initialAssignments);
            funnel = WaitingForVolunteer.init(
              candidateFactory,
              assignments,
              assignment,
            );
          });
          it("should be able to assign him as confiance", async () => {
            const selected = await funnel.select(volunteer);
            if (!isEveryCandidateFulfillsDemand(selected)) {
              throw new Error("Unexpected funnel type");
            }

            const assignment = await selected.assign();

            const expectedAssignee = { as: CONFIANCE, id: volunteer.id };
            expect(assignment.assignees).toContainEqual(expectedAssignee);
          });
        },
      );
    });
    describe("when assignment needs several team member", () => {
      describe.each`
        assignmentName            | assignment           | volunteer         | volunteerName               | volunteerTeams
        ${scannerLesBillets.name} | ${scannerLesBillets} | ${noel.volunteer} | ${noel.volunteer.firstname} | ${noel.volunteer.teams}
      `(
        "When selecting $volunteerName who is part of $volunteerTeams on $assignmentName",
        ({ assignment, volunteer }) => {
          let funnel: SomeCandidatesNotFulfillingDemand;
          beforeAll(async () => {
            const assignments = new InMemoryAssignments(initialAssignments);
            const selected = await WaitingForVolunteer.init(
              candidateFactory,
              assignments,
              assignment,
            ).select(volunteer);
            if (isEveryCandidateFulfillsDemand(selected)) {
              throw new Error("Unexpected funnel type");
            }
            funnel = selected;
          });
          it(`should list ${CONFIANCE} as assignable team`, () => {
            expect(
              funnel.candidates.find(({ id }) => id === volunteer.id)
                ?.assignableTeams,
            ).toContain(CONFIANCE);
          });
          it(`should be possible to assign him as ${CONFIANCE}`, () => {
            const demand = { volunteer: volunteer.id, team: CONFIANCE };
            expect(() => funnel.fulfillDemand(demand)).not.toThrow();
          });
        },
      );
    });
  });
});
