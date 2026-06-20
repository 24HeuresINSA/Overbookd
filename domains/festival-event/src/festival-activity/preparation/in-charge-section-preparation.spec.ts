import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity.js";
import {
  escapeGame,
  justDance,
  pcSecurite,
  approvedByHumain,
} from "./preparation.test-utils.js";
import { george, lafarge } from "../festival-activity.fake.js";
import { lea } from "../festival-activity.fake";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory.js";
import { ContractorNotFound } from "../festival-activity.error.js";
import { HUMAIN } from "../../common/review.js";
import { PrepareError } from "./prepare-in-review-festival-activity.js";
import { VIEUX } from "@overbookd/team-constants";

describe("In Charge section of festival activity preparation", () => {
  let prepareFestivalActivity: PrepareFestivalActivity;
  let prepareFestivalActivities: InMemoryPrepareFestivalActivityRepository;

  beforeEach(() => {
    prepareFestivalActivities = new InMemoryPrepareFestivalActivityRepository([
      escapeGame,
      pcSecurite,
      justDance,
      approvedByHumain,
    ]);
    prepareFestivalActivity = new PrepareFestivalActivity(
      prepareFestivalActivities,
    );
  });

  describe.each`
    fields                 | activityName               | activityId       | update                                  | adherent                        | team                        | contractors
    ${"adherent"}          | ${escapeGame.general.name} | ${escapeGame.id} | ${{ adherent: lea }}                    | ${lea}                          | ${escapeGame.inCharge.team} | ${escapeGame.inCharge.contractors}
    ${"adherent"}          | ${justDance.general.name}  | ${justDance.id}  | ${{ adherent: george }}                 | ${george}                       | ${justDance.inCharge.team}  | ${justDance.inCharge.contractors}
    ${"team"}              | ${escapeGame.general.name} | ${escapeGame.id} | ${{ team: "plaizir" }}                  | ${escapeGame.inCharge.adherent} | ${"plaizir"}                | ${escapeGame.inCharge.contractors}
    ${"team"}              | ${justDance.general.name}  | ${justDance.id}  | ${{ team: VIEUX }}                      | ${justDance.inCharge.adherent}  | ${VIEUX}                    | ${justDance.inCharge.contractors}
    ${"adherent and team"} | ${escapeGame.general.name} | ${escapeGame.id} | ${{ team: "Qlture", adherent: george }} | ${george}                       | ${"Qlture"}                 | ${escapeGame.inCharge.contractors}
    ${"adherent and team"} | ${justDance.general.name}  | ${justDance.id}  | ${{ team: "culture", adherent: lea }}   | ${lea}                          | ${"culture"}                | ${justDance.inCharge.contractors}
  `(
    "when updating $fields from $activityName",
    ({ fields, activityId, update, adherent, team, contractors }) => {
      it(`should only update ${fields}`, async () => {
        const { inCharge } =
          await prepareFestivalActivity.updateInChargeSection(
            activityId,
            update,
          );
        expect(inCharge.adherent).toEqual(adherent);
        expect(inCharge.team).toBe(team);

        expect(inCharge.contractors).toEqual(contractors);
      });
    },
  );

  describe("when adherent want to update multiple fields consecutively", () => {
    describe("when adherent want to update adherent then team in 2 times", () => {
      it("should update both adherent and team", async () => {
        const updateAdherent = { adherent: lea };
        const updateTeam = { team: "plaizir" };

        await prepareFestivalActivity.updateInChargeSection(
          escapeGame.id,
          updateAdherent,
        );

        const { inCharge } =
          await prepareFestivalActivity.updateInChargeSection(
            escapeGame.id,
            updateTeam,
          );

        expect(inCharge.adherent).toEqual(lea);
        expect(inCharge.team).toBe(updateTeam.team);
      });
    });
  });

  describe.each`
    contractor                                                                                                                                               | activityName               | activity      | expectedFirstName | expectedLastName | expectedPhoneNumber | expectedEmail            | expectedCompany | expectedComment
    ${{ firstName: "Benjos", lastName: "Le Magicos", phoneNumber: "0612345678" }}                                                                            | ${escapeGame.general.name} | ${escapeGame} | ${"Benjos"}       | ${"Le Magicos"}  | ${"0612345678"}     | ${null}                  | ${null}         | ${null}
    ${{ firstName: "Rick", lastName: "Astley", phoneNumber: "0611111111", comment: "Never gonna give you up" }}                                              | ${justDance.general.name}  | ${justDance}  | ${"Rick"}         | ${"Astley"}      | ${"0611111111"}     | ${null}                  | ${null}         | ${"Never gonna give you up"}
    ${{ firstName: "Noel", lastName: "Pere", phoneNumber: "0600000000", email: "groenland@gmail.com", company: "Groenland", comment: "Type un peu louche" }} | ${pcSecurite.general.name} | ${pcSecurite} | ${"Noel"}         | ${"Pere"}        | ${"0600000000"}     | ${"groenland@gmail.com"} | ${"Groenland"}  | ${"Type un peu louche"}
  `(
    "when adherent want to add a contractor in $activityName",
    ({
      contractor,
      activity,
      expectedFirstName,
      expectedLastName,
      expectedPhoneNumber,
      expectedEmail,
      expectedCompany,
      expectedComment,
    }) => {
      it("should add the contractor", async () => {
        const { inCharge } = await prepareFestivalActivity.addContractor(
          activity.id,
          contractor,
        );

        const expectedContractor = {
          id: expect.any(Number),
          firstName: expectedFirstName,
          lastName: expectedLastName,
          phoneNumber: expectedPhoneNumber,
          email: expectedEmail,
          company: expectedCompany,
          comment: expectedComment,
        };

        expect(inCharge.contractors).toContainEqual(expectedContractor);
      });
    },
  );

  const jeanDupont = escapeGame.inCharge.contractors[0];
  const jeanDupontName = `${jeanDupont.firstName} ${jeanDupont.lastName}`;

  const charlesHenry = justDance.inCharge.contractors[0];
  const charlesHenryName = `${charlesHenry.firstName} ${charlesHenry.lastName}`;

  describe.each`
    fields                                      | activityName               | activityId       | contractorName      | contractor      | update
    ${"phoneNumber"}                            | ${escapeGame.general.name} | ${escapeGame.id} | ${jeanDupontName}   | ${jeanDupont}   | ${{ phoneNumber: "0612451729" }}
    ${"phoneNumber"}                            | ${justDance.general.name}  | ${justDance.id}  | ${charlesHenryName} | ${charlesHenry} | ${{ phoneNumber: "0707070707" }}
    ${"email"}                                  | ${escapeGame.general.name} | ${escapeGame.id} | ${jeanDupontName}   | ${jeanDupont}   | ${{ email: "jean@dupont.fr" }}
    ${"company"}                                | ${escapeGame.general.name} | ${escapeGame.id} | ${jeanDupontName}   | ${jeanDupont}   | ${{ company: "Auto-Dupont" }}
    ${"comment"}                                | ${escapeGame.general.name} | ${escapeGame.id} | ${jeanDupontName}   | ${jeanDupont}   | ${{ comment: "Fait des dad jokes" }}
    ${"comment"}                                | ${justDance.general.name}  | ${justDance.id}  | ${charlesHenryName} | ${charlesHenry} | ${{ comment: "Avec son gros pif" }}
    ${"phoneNumber and email"}                  | ${escapeGame.general.name} | ${escapeGame.id} | ${jeanDupontName}   | ${jeanDupont}   | ${{ phoneNumber: "0615372947", email: "jean@dupont.com" }}
    ${"company and lastName"}                   | ${escapeGame.general.name} | ${escapeGame.id} | ${jeanDupontName}   | ${jeanDupont}   | ${{ company: null, lastName: "De La Porte" }}
    ${"firstName, lastName, company and email"} | ${escapeGame.general.name} | ${escapeGame.id} | ${jeanDupontName}   | ${jeanDupont}   | ${{ firstName: "Inco", lastName: "Nito", company: null, email: null }}
    ${"firstName, lastName, company and email"} | ${justDance.general.name}  | ${justDance.id}  | ${charlesHenryName} | ${charlesHenry} | ${{ firstName: "Didier", lastName: "Jacques", company: "Didi & co", email: null }}
  `(
    "when updating $fields from $contractorName in $activityName",
    ({ fields, activityId, contractor, update }) => {
      it(`should only update ${fields}`, async () => {
        const { inCharge } = await prepareFestivalActivity.updateContractor(
          activityId,
          { id: contractor.id, ...update },
        );
        expect(inCharge.contractors).toContainEqual({
          ...contractor,
          ...update,
        });
      });
    },
  );

  describe("when adherent updating a contractor that does not exist", () => {
    it("should indicate that contractor does not exist", async () => {
      const contractorToUpdate = {
        id: 10,
        comment: "Oui",
      };

      await expect(
        prepareFestivalActivity.updateContractor(
          escapeGame.id,
          contractorToUpdate,
        ),
      ).rejects.toThrow(ContractorNotFound);
    });
  });

  describe.each`
    activity      | activityName
    ${escapeGame} | ${escapeGame.general.name}
    ${justDance}  | ${justDance.general.name}
  `("when removing the first contractor of $activityName", ({ activity }) => {
    const contractorToRemove = activity.inCharge.contractors[0];

    it("should remove the contractor", async () => {
      const { inCharge } = await prepareFestivalActivity.removeContractor(
        activity.id,
        contractorToRemove.id,
      );

      expect(inCharge.contractors).not.toContainEqual(contractorToRemove);
    });
  });

  describe(`when ${approvedByHumain.general.name} is already validated by ${HUMAIN}`, () => {
    describe("when trying to update in charge information", () => {
      it("should indicate that in charge section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.updateInChargeSection(
              approvedByHumain.id,
              { team: "sports" },
            ),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
    describe("when trying to add a contractor", () => {
      it("should indicate that in charge section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.addContractor(approvedByHumain.id, {
              firstName: "Benjos",
              lastName: "Le Magicos",
              phoneNumber: "0612345678",
            }),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
    describe("when trying to remove a contractor", () => {
      it("should indicate that in charge section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.removeContractor(
              approvedByHumain.id,
              lafarge.id,
            ),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
    describe("when trying to update a contractor", () => {
      it("should indicate that in charge section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.updateContractor(
              approvedByHumain.id,
              { id: lafarge.id, firstName: "Davis" },
            ),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
  });
});
