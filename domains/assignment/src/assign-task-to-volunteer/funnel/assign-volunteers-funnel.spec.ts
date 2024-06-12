import { beforeAll, describe, expect, it } from "vitest";
import { BENEVOLE_CODE } from "@overbookd/team";
import { WaitingForVolunteer } from "./startup-funnel.js";
import { InMemoryPlanning } from "./planning.inmemory.js";
import { InMemoryAssignments } from "../repositories/assignments.inmemory.js";
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
  nettoyerLeQgCatering,
  nathan,
  bruce,
  amanda,
  barmanBarDeLambiance,
  collageParcoursF,
} from "./assign-volunteers-funnel.test-utils.js";
import { CandidateFactory } from "./candidate.js";
import { CONDUCTEUR, CONFIANCE, HARD, VIEUX } from "../../teams.js";
import { InMemoryAvailabilities } from "./availabilities.inmemory.js";
import { InMemoryFriends } from "./friends.inmemory.js";
import { IActAsFunnel } from "./funnel.js";
import { BreakPeriods } from "./planning.js";
import { IProvidePeriod } from "@overbookd/period";
import { Volunteer } from "../../volunteer.js";

class InMemoryBreakPeriods implements BreakPeriods {
  constructor(private breakPeriods: Map<Volunteer["id"], IProvidePeriod[]>) {}

  for(volunteer: Volunteer["id"]): Promise<IProvidePeriod[]> {
    return Promise.resolve(this.breakPeriods.get(volunteer) ?? []);
  }
}

describe("Assign volunteers funnel", () => {
  const inMemoryPlanning = new InMemoryPlanning(
    new Map([
      [noel.volunteer.id, noel.planning],
      [lea.volunteer.id, lea.planning],
      [ontaine.volunteer.id, ontaine.planning],
      [tatouin.volunteer.id, tatouin.planning],
      [luce.volunteer.id, luce.planning],
      [nathan.volunteer.id, nathan.planning],
      [bruce.volunteer.id, bruce.planning],
      [amanda.volunteer.id, amanda.planning],
    ]),
  );
  const inMemoryAvailabilities = new InMemoryAvailabilities(
    new Map([
      [noel.volunteer.id, noel.availabilities],
      [lea.volunteer.id, lea.availabilities],
      [ontaine.volunteer.id, ontaine.availabilities],
      [tatouin.volunteer.id, tatouin.availabilities],
      [nathan.volunteer.id, nathan.availabilities],
      [bruce.volunteer.id, bruce.availabilities],
      [amanda.volunteer.id, amanda.availabilities],
    ]),
  );
  const inMemoryBreakPeriods = new InMemoryBreakPeriods(
    new Map([
      [noel.volunteer.id, noel.breakPeriods],
      [lea.volunteer.id, lea.breakPeriods],
      [ontaine.volunteer.id, ontaine.breakPeriods],
      [tatouin.volunteer.id, tatouin.breakPeriods],
      [nathan.volunteer.id, nathan.breakPeriods],
      [bruce.volunteer.id, bruce.breakPeriods],
      [amanda.volunteer.id, amanda.breakPeriods],
    ]),
  );
  const friends = new InMemoryFriends(new Map());
  const initialAssignments = [
    benevolant,
    rendreKangoo,
    couperDesCarottes,
    gererLaCaisse,
    demonterLesJeuxGonflables,
    nettoyerLeQgCatering,
    collageParcoursF,
  ];
  const agendas = {
    planning: inMemoryPlanning,
    availabilities: inMemoryAvailabilities,
    breakPeriods: inMemoryBreakPeriods,
  };
  const candidateFactory = new CandidateFactory(agendas, friends);
  describe("when assignment has only one team member needs remaining", () => {
    describe.each`
      volunteerName                  | volunteer            | taskName                          | task                         | team             | candidates             | planning            | availabilities            | breakPeriods
      ${noel.volunteer.firstname}    | ${noel.volunteer}    | ${benevolant.name}                | ${benevolant}                | ${BENEVOLE_CODE} | ${[noel.volunteer]}    | ${noel.planning}    | ${noel.availabilities}    | ${noel.breakPeriods}
      ${lea.volunteer.firstname}     | ${lea.volunteer}     | ${benevolant.name}                | ${benevolant}                | ${BENEVOLE_CODE} | ${[lea.volunteer]}     | ${lea.planning}     | ${lea.availabilities}     | ${lea.breakPeriods}
      ${ontaine.volunteer.firstname} | ${ontaine.volunteer} | ${couperDesCarottes.name}         | ${couperDesCarottes}         | ${"catering"}    | ${[ontaine.volunteer]} | ${ontaine.planning} | ${ontaine.availabilities} | ${ontaine.breakPeriods}
      ${noel.volunteer.firstname}    | ${noel.volunteer}    | ${demonterLesJeuxGonflables.name} | ${demonterLesJeuxGonflables} | ${BENEVOLE_CODE} | ${[noel.volunteer]}    | ${noel.planning}    | ${noel.availabilities}    | ${noel.breakPeriods}
    `(
      "when selecting $volunteerName as available volunteer on task $taskName",
      ({
        volunteer,
        candidates,
        planning,
        task,
        team,
        availabilities,
        breakPeriods,
      }) => {
        let everyCandidateFulfillsDemand: IActAsFunnel;
        let assignments: InMemoryAssignments;
        beforeAll(async () => {
          assignments = new InMemoryAssignments(initialAssignments);
          const friends = new InMemoryFriends(
            new Map([
              [noel.volunteer.id, [lea.volunteer, ontaine.volunteer]],
              [lea.volunteer.id, [noel.volunteer, ontaine.volunteer]],
              [ontaine.volunteer.id, [lea.volunteer, noel.volunteer]],
            ]),
          );
          const candidateFactory = new CandidateFactory(agendas, friends);
          const funnel = WaitingForVolunteer.init(
            candidateFactory,
            assignments,
            task,
          );
          everyCandidateFulfillsDemand = await funnel.select(volunteer);
        });
        it("should expose him as a candidate", () => {
          expect(everyCandidateFulfillsDemand.candidates).toMatchObject(
            candidates,
          );
        });
        it("should indicate it can't select another candidate", () => {
          expect(everyCandidateFulfillsDemand.canChangeLastCandidate).toBe(
            false,
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
        it("should expose his break periods", () => {
          expect(
            everyCandidateFulfillsDemand.candidates.at(0)?.breakPeriods,
          ).toStrictEqual(breakPeriods);
        });
        it("should indicate it can't fulfill more demands (cause there is no demand any more)", () => {
          expect(
            everyCandidateFulfillsDemand.canFulfillMoreRemainingDemands,
          ).toBe(false);
        });
        describe("when assigning selected volunteers", () => {
          it("should save new assignments", async () => {
            const expectedAssignees = [
              ...task.assignees,
              { id: volunteer.id, as: team },
            ];
            await everyCandidateFulfillsDemand.assign();

            expect(assignments.all).toContainEqual({
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
      let funnel: IActAsFunnel;
      let assignments: InMemoryAssignments;
      beforeAll(async () => {
        assignments = new InMemoryAssignments(initialAssignments);
        funnel = await WaitingForVolunteer.init(
          candidateFactory,
          assignments,
          rendreKangoo,
        ).select(noel.volunteer);
      });
      it("should select benevole as team assignment", () => {
        const [noelCandidate, ..._candidates] = funnel.candidates;
        expect(noelCandidate.as).toBe(BENEVOLE_CODE);
      });
      it("should indicate it can't fulfill more demands (cause there is no assignable friend for fulfilling it)", () => {
        expect(funnel.canFulfillMoreRemainingDemands).toBe(false);
      });
      describe("when assigning selected volunteers", () => {
        it("should save new assignments", async () => {
          const expectedAssignees = [
            ...rendreKangoo.assignees,
            { id: noel.volunteer.id, as: BENEVOLE_CODE },
          ];
          await funnel.assign();

          expect(assignments.all).toContainEqual({
            ...rendreKangoo,
            assignees: expectedAssignees,
          });
        });
      });
    });
    describe("when selected volunteer is member of both benevole and conducteur", () => {
      let volunteerFunnel: IActAsFunnel;
      const volunteer = lea.volunteer;
      let assignments: InMemoryAssignments;
      beforeAll(async () => {
        assignments = new InMemoryAssignments(initialAssignments);
        volunteerFunnel = await WaitingForVolunteer.init(
          candidateFactory,
          assignments,
          rendreKangoo,
        ).select(volunteer);
      });
      it("should NOT select team assignment", () => {
        const [candidate, ..._candidates] = volunteerFunnel.candidates;
        expect(candidate.as).toBeUndefined();
      });
      it("should indicate it can't fulfill more demands (cause there is no assignable friend for fulfilling it)", () => {
        expect(volunteerFunnel.canFulfillMoreRemainingDemands).toBe(false);
      });
      describe.each`
        team
        ${BENEVOLE_CODE}
        ${CONDUCTEUR}
      `(
        "when defininig $team assignment for selected volunteer",
        ({ team }) => {
          let withAssignmentFunnel: IActAsFunnel;
          beforeAll(async () => {
            assignments = new InMemoryAssignments(initialAssignments);
            volunteerFunnel = await WaitingForVolunteer.init(
              candidateFactory,
              assignments,
              rendreKangoo,
            ).select(volunteer);
            const definition = { volunteer: volunteer.id, team };
            withAssignmentFunnel = volunteerFunnel.fulfillDemand(definition);
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
              await withAssignmentFunnel.assign();

              expect(assignments.all).toContainEqual({
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
        assignment       | volunteer           | team
        ${gererLaCaisse} | ${luce.volunteer}   | ${HARD}
        ${gererLaCaisse} | ${nathan.volunteer} | ${VIEUX}
      `(
        "when volunteer selected is part of $team",
        ({ assignment, volunteer }) => {
          let funnel: WaitingForVolunteer;
          let assignments: InMemoryAssignments;
          beforeAll(() => {
            assignments = new InMemoryAssignments(initialAssignments);
            funnel = WaitingForVolunteer.init(
              candidateFactory,
              assignments,
              assignment,
            );
          });
          it("should be able to assign him as confiance", async () => {
            const selected = await funnel.select(volunteer);

            await selected.assign();

            const expectedAssignee = { as: CONFIANCE, id: volunteer.id };
            const expectAssignment = {
              ...assignment,
              assignees: [...assignment.assignees, expectedAssignee],
            };
            expect(assignments.all).toContainEqual(expectAssignment);
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
          let funnel: IActAsFunnel;
          beforeAll(async () => {
            const assignments = new InMemoryAssignments(initialAssignments);
            funnel = await WaitingForVolunteer.init(
              candidateFactory,
              assignments,
              assignment,
            ).select(volunteer);
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
  describe("Assign multiple candidate", () => {
    describe(`
    Given:
      Ontain is benevole and friend with Tatouin,
      Tatouin is benevole and has no more friends,
      Both are available during nettoyer le QG catering,
      3 benevoles are demanded for Nettoyer le QG catering
    `, () => {
      let funnel: IActAsFunnel;
      let assignments: InMemoryAssignments;
      beforeAll(async () => {
        const friends = new InMemoryFriends(
          new Map([
            [ontaine.volunteer.id, [tatouin.volunteer]],
            [tatouin.volunteer.id, [ontaine.volunteer]],
          ]),
        );
        const candidateFactory = new CandidateFactory(agendas, friends);
        assignments = new InMemoryAssignments(initialAssignments);
        funnel = await WaitingForVolunteer.init(
          candidateFactory,
          assignments,
          nettoyerLeQgCatering,
        ).select(ontaine.volunteer);
      });
      it("should indicate it can fulfill more demands", () => {
        expect(funnel.canFulfillMoreRemainingDemands).toBe(true);
      });
      describe("when adding a candidate", () => {
        let multipleCandidate: IActAsFunnel;
        beforeAll(async () => {
          multipleCandidate = await funnel.addCandidate();
        });
        it("should add tatouin", async () => {
          expect(multipleCandidate.candidates).toHaveLength(2);
          expect(multipleCandidate.candidates.at(1)).toMatchObject(
            tatouin.volunteer,
          );
        });
        it("should indicate it can't fulfill more demands (cause there is no assignable friend for fulfilling it", () => {
          expect(multipleCandidate.canFulfillMoreRemainingDemands).toBe(false);
        });
        it("should indicate it can't select another candidate", () => {
          expect(multipleCandidate.canChangeLastCandidate).toBe(false);
        });
        describe("when assigning both ontain and tatouin", () => {
          it("should save them as assignees for the task", async () => {
            const expectedAssignees = [
              ...nettoyerLeQgCatering.assignees,
              { id: ontaine.volunteer.id, as: BENEVOLE_CODE },
              { id: tatouin.volunteer.id, as: BENEVOLE_CODE },
            ];
            await multipleCandidate.assign();

            expect(assignments.all).toContainEqual({
              ...nettoyerLeQgCatering,
              assignees: expectedAssignees,
            });
          });
        });
      });
    });
    describe(`
    Given:
      Ontaine is benevole and friend with Tatouin and Lea,
      Tatouin is benevole and has no more friends,
      Lea is benevole and friend with Noel
      All of them are available during nettoyer le QG catering,
      3 benevoles are demanded for Nettoyer le QG catering
    `, () => {
      let funnel: IActAsFunnel;
      let assignments: InMemoryAssignments;
      beforeAll(async () => {
        const friends = new InMemoryFriends(
          new Map([
            [ontaine.volunteer.id, [tatouin.volunteer, lea.volunteer]],
            [tatouin.volunteer.id, [ontaine.volunteer]],
            [lea.volunteer.id, [noel.volunteer, ontaine.volunteer]],
            [noel.volunteer.id, [lea.volunteer]],
          ]),
        );
        const candidateFactory = new CandidateFactory(agendas, friends);
        assignments = new InMemoryAssignments(initialAssignments);
        funnel = await WaitingForVolunteer.init(
          candidateFactory,
          assignments,
          nettoyerLeQgCatering,
        ).select(ontaine.volunteer);
      });
      it("should indicate it can fulfill more demands", () => {
        expect(funnel.canFulfillMoreRemainingDemands).toBe(true);
      });
      describe("when adding a candidate", () => {
        let multipleCandidate: IActAsFunnel;
        beforeAll(async () => {
          multipleCandidate = await funnel.addCandidate();
        });
        it("should add tatouin", async () => {
          expect(multipleCandidate.candidates).toHaveLength(2);
          expect(multipleCandidate.candidates.at(1)).toMatchObject(
            tatouin.volunteer,
          );
        });
        it("should indicate it can still fulfill more demands", () => {
          expect(multipleCandidate.canFulfillMoreRemainingDemands).toBe(true);
        });
        describe("when adding a new candidate", () => {
          let evenMoreCandidate: IActAsFunnel;
          beforeAll(async () => {
            evenMoreCandidate = await multipleCandidate.addCandidate();
          });
          it("should add lea", () => {
            expect(evenMoreCandidate.candidates).toHaveLength(3);
            expect(evenMoreCandidate.candidates.at(2)).toMatchObject(
              lea.volunteer,
            );
          });
          describe("when revoking last candidate", () => {
            let revokingLea: IActAsFunnel;
            beforeAll(async () => {
              revokingLea = evenMoreCandidate.revokeLastCandidate();
            });
            it("should remove lea from candidate", () => {
              expect(revokingLea.candidates).not.toContain(lea.volunteer);
            });
            it("should retrieve tatouin as latest candidate", () => {
              expect(revokingLea.candidates).toHaveLength(2);
              expect(revokingLea.candidates.at(1)).toMatchObject(
                tatouin.volunteer,
              );
            });
          });
        });
        it("should indicate it can select another candidate", () => {
          expect(multipleCandidate.canChangeLastCandidate).toBe(true);
        });
        describe("when selecting the next candidate", () => {
          let leaAsSecondCandidate: IActAsFunnel;
          beforeAll(async () => {
            leaAsSecondCandidate = await multipleCandidate.nextCandidate();
          });
          it("should select lea", () => {
            expect(leaAsSecondCandidate.candidates).toHaveLength(2);
            expect(leaAsSecondCandidate.candidates.at(1)).toMatchObject(
              lea.volunteer,
            );
          });
          it("should indicate it can still fulfill more demands", () => {
            expect(leaAsSecondCandidate.canFulfillMoreRemainingDemands).toBe(
              true,
            );
          });
        });
        describe("when selecting the next candidate", () => {
          let leaAsSecondCandidate: IActAsFunnel;
          beforeAll(async () => {
            leaAsSecondCandidate = await multipleCandidate.previousCandidate();
          });
          it("should select lea", () => {
            expect(leaAsSecondCandidate.candidates).toHaveLength(2);
            expect(leaAsSecondCandidate.candidates.at(1)).toMatchObject(
              lea.volunteer,
            );
          });
        });
      });
    });
    describe(`
    Given:
      Ontaine is benevole and friend with Tatouin, Lea and Noel,
      Tatouin is benevole and friend with Ontaine, Bruce, Lea, Luce, Amanda and Noel
      All of them are available during barman bar de l'ambiance,
      7 benevoles are demanded for barman bar de l'ambiance,
      Ontaine and Tatouin are already selected as candidate
    `, () => {
      let funnel: IActAsFunnel;
      beforeAll(async () => {
        const friends = new InMemoryFriends(
          new Map([
            [
              ontaine.volunteer.id,
              [tatouin.volunteer, lea.volunteer, noel.volunteer],
            ],
            [
              tatouin.volunteer.id,
              [
                ontaine.volunteer,
                bruce.volunteer,
                lea.volunteer,
                luce.volunteer,
                amanda.volunteer,
                noel.volunteer,
              ],
            ],
            [lea.volunteer.id, [ontaine.volunteer, tatouin.volunteer]],
            [noel.volunteer.id, [ontaine.volunteer, tatouin.volunteer]],
            [bruce.volunteer.id, [tatouin.volunteer]],
            [luce.volunteer.id, [tatouin.volunteer]],
            [amanda.volunteer.id, [tatouin.volunteer]],
          ]),
        );
        const candidateFactory = new CandidateFactory(agendas, friends);
        const assignments = new InMemoryAssignments(initialAssignments);
        const ontaineSelected = await WaitingForVolunteer.init(
          candidateFactory,
          assignments,
          barmanBarDeLambiance,
        ).select(ontaine.volunteer);
        const tatouinSelected = await ontaineSelected.addCandidate();
        funnel = await tatouinSelected.addCandidate();
      });
      it("should have both Ontaine and Tatouin as candidates", () => {
        expect(funnel.candidates).toHaveLength(3);
      });
      it.each`
        volunteerName                 | volunteer
        ${lea.volunteer.firstname}    | ${lea.volunteer}
        ${noel.volunteer.firstname}   | ${noel.volunteer}
        ${bruce.volunteer.firstname}  | ${bruce.volunteer}
        ${amanda.volunteer.firstname} | ${amanda.volunteer}
        ${luce.volunteer.firstname}   | ${luce.volunteer}
      `(
        "should be possible to select $volunteerName",
        async ({ volunteer }) => {
          for (let iteration = 0; iteration < 7; iteration++) {
            const lastCanidate = funnel.candidates.at(-1);
            if (lastCanidate?.id === volunteer.id) break;
            funnel = await funnel.nextCandidate();
          }

          expect(funnel.candidates.at(2)).toMatchObject(volunteer);
        },
      );
    });
    describe(`
    Given:
      Lea is benevole and conducteur and friend with Noel,
      Noel is benevole and friend with Lea,
      All of them are available during collage parcours F,
      1 benevole and 1 conducteur are demanded for collage parcours F,
      Lea is already selected as candidate
    `, () => {
      let leaSelected: IActAsFunnel;
      beforeAll(async () => {
        const friends = new InMemoryFriends(
          new Map([
            [lea.volunteer.id, [noel.volunteer]],
            [noel.volunteer.id, [lea.volunteer]],
          ]),
        );
        const candidateFactory = new CandidateFactory(agendas, friends);
        const assignments = new InMemoryAssignments(initialAssignments);
        leaSelected = await WaitingForVolunteer.init(
          candidateFactory,
          assignments,
          collageParcoursF,
        ).select(lea.volunteer);
      });
      describe("when adding a candidate", () => {
        let withNoel: IActAsFunnel;
        beforeAll(async () => {
          withNoel = await leaSelected.addCandidate();
        });
        it(`should auto assign ${BENEVOLE_CODE} to Noel`, () => {
          expect(withNoel.candidates.at(1)?.as).toBe(BENEVOLE_CODE);
        });
        it(`should auto assign ${CONDUCTEUR} to Lea`, () => {
          expect(withNoel.candidates.at(0)?.as).toBe(CONDUCTEUR);
        });
      });
      describe(`when assigning lea as ${BENEVOLE_CODE}`, () => {
        let leaAsBenevole: IActAsFunnel;
        beforeAll(async () => {
          const leaToBenevole = {
            volunteer: lea.volunteer.id,
            team: BENEVOLE_CODE,
          };
          leaAsBenevole = leaSelected.fulfillDemand(leaToBenevole);
        });
        it("should indicate it can't fulfill more demands (cause none of the remaining friends are assignable)", () => {
          expect(leaAsBenevole.canFulfillMoreRemainingDemands).toBe(false);
        });
      });
    });
  });
  describe(`
    Given:
      Lea is benevole and conducteur and friend with Tatouin and Noel,
      Tatouin is benevole and conducteur and friend with Lea,
      Noel is benevole and friend with Lea,
      All of them are available during collage parcours F,
      1 benevole and 1 conducteur are demanded for collage parcours F,
      Lea is already selected as candidate and Tatouin is the current latest candidate
    `, () => {
    let funnel: IActAsFunnel;
    beforeAll(async () => {
      const friends = new InMemoryFriends(
        new Map([
          [lea.volunteer.id, [tatouin.volunteer, noel.volunteer]],
          [tatouin.volunteer.id, [lea.volunteer]],
          [noel.volunteer.id, [lea.volunteer]],
        ]),
      );
      const candidateFactory = new CandidateFactory(agendas, friends);
      const assignments = new InMemoryAssignments(initialAssignments);
      const leaSelected = await WaitingForVolunteer.init(
        candidateFactory,
        assignments,
        collageParcoursF,
      ).select(lea.volunteer);
      funnel = await leaSelected.addCandidate();
    });
    it("should indicate it can't fulfill more demands (cause remaining assignments can be fulfilled by current candidates)", () => {
      expect(funnel.canFulfillMoreRemainingDemands).toBe(false);
    });
    describe.each`
      volunteerName                  | volunteer            | team             | expectedLeaAssignment | expectedTatouinAssignment
      ${tatouin.volunteer.firstname} | ${tatouin.volunteer} | ${BENEVOLE_CODE} | ${CONDUCTEUR}         | ${BENEVOLE_CODE}
      ${tatouin.volunteer.firstname} | ${tatouin.volunteer} | ${CONDUCTEUR}    | ${BENEVOLE_CODE}      | ${CONDUCTEUR}
      ${lea.volunteer.firstname}     | ${lea.volunteer}     | ${CONDUCTEUR}    | ${CONDUCTEUR}         | ${BENEVOLE_CODE}
      ${lea.volunteer.firstname}     | ${lea.volunteer}     | ${BENEVOLE_CODE} | ${BENEVOLE_CODE}      | ${CONDUCTEUR}
    `(
      "when assign $volunteerName as $team",
      ({
        volunteer,
        team,
        expectedLeaAssignment,
        expectedTatouinAssignment,
      }) => {
        let fulfillingDemands: IActAsFunnel;
        beforeAll(async () => {
          fulfillingDemands = funnel.fulfillDemand({
            volunteer: volunteer.id,
            team,
          });
        });
        it(`should assign Lea as ${expectedLeaAssignment}`, () => {
          expect(fulfillingDemands.candidates.at(0)?.as).toBe(
            expectedLeaAssignment,
          );
        });
        it(`should assign Tatouin as ${expectedTatouinAssignment}`, () => {
          expect(fulfillingDemands.candidates.at(1)?.as).toBe(
            expectedTatouinAssignment,
          );
        });
      },
    );
    describe("when selecting next candidate", () => {
      let noelAsLastCandidate: IActAsFunnel;
      beforeAll(async () => {
        noelAsLastCandidate = await funnel.nextCandidate();
      });
      it(`should auto assign ${BENEVOLE_CODE} to Noel`, () => {
        expect(noelAsLastCandidate.candidates.at(1)?.as).toBe(BENEVOLE_CODE);
      });
      it(`should auto assign ${CONDUCTEUR} to Lea`, () => {
        expect(noelAsLastCandidate.candidates.at(0)?.as).toBe(CONDUCTEUR);
      });
      describe(`when trying to assign Lea as ${BENEVOLE_CODE}`, () => {
        it(`should keep her assigned to ${CONDUCTEUR}`, () => {
          const leaAsBenevole = {
            volunteer: lea.volunteer.id,
            team: BENEVOLE_CODE,
          };
          const tryingToAssignLeaAsBenevole =
            noelAsLastCandidate.fulfillDemand(leaAsBenevole);
          expect(tryingToAssignLeaAsBenevole.candidates.at(0)?.as).toBe(
            CONDUCTEUR,
          );
        });
      });
    });
  });
  describe(`
  Given:
      Lea is benevole and vieux and friend with Ontaine and Noel,
      Ontaine is benevole and conducteur and friend with Lea,
      Noel is benevole and vieux and friend with Lea,
      All of them are available Scanner les billets,
      1 confiance and 5 benevoles are demanded for Scanner les billets,
      5 other volunteer where namely required and already assigned
      Lea is already selected as candidate
  `, () => {
    let funnel: IActAsFunnel;
    beforeAll(async () => {
      const friends = new InMemoryFriends(
        new Map([
          [lea.volunteer.id, [tatouin.volunteer, noel.volunteer]],
          [tatouin.volunteer.id, [lea.volunteer]],
          [noel.volunteer.id, [lea.volunteer]],
        ]),
      );
      const candidateFactory = new CandidateFactory(agendas, friends);
      const assignments = new InMemoryAssignments(initialAssignments);
      funnel = await WaitingForVolunteer.init(
        candidateFactory,
        assignments,
        scannerLesBillets,
      ).select(lea.volunteer);
    });
    it("should indicate it can fulfill more demands", () => {
      expect(funnel.canFulfillMoreRemainingDemands).toBe(true);
    });
  });
});
