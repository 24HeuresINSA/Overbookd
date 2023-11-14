import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import {
  escapeGame,
  george,
  justDance,
  lea,
  pcSecurite,
} from "./preparation.test-utils";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import { ContractorNotFound } from "../festival-activity.error";

describe("In Charge section of festival activity preparation", () => {
  let prepareFestivalActivity: PrepareFestivalActivity;
  let prepareFestivalActivities: InMemoryPrepareFestivalActivityRepository;

  beforeEach(() => {
    prepareFestivalActivities = new InMemoryPrepareFestivalActivityRepository([
      escapeGame,
      pcSecurite,
      justDance,
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
    ${"team"}              | ${justDance.general.name}  | ${justDance.id}  | ${{ team: "vieux" }}                    | ${justDance.inCharge.adherent}  | ${"vieux"}                  | ${justDance.inCharge.contractors}
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
    contractor                                                                                                                                         | activityName               | activity      | expectedFirstname | expectedLastname | expectedPhone   | expectedEmail            | expectedCompany | expectedComment
    ${{ firstname: "Benjos", lastname: "Le Magicos", phone: "0612345678" }}                                                                            | ${escapeGame.general.name} | ${escapeGame} | ${"Benjos"}       | ${"Le Magicos"}  | ${"0612345678"} | ${null}                  | ${null}         | ${null}
    ${{ firstname: "Rick", lastname: "Astley", phone: "0611111111", comment: "Never gonna give you up" }}                                              | ${justDance.general.name}  | ${justDance}  | ${"Rick"}         | ${"Astley"}      | ${"0611111111"} | ${null}                  | ${null}         | ${"Never gonna give you up"}
    ${{ firstname: "Noel", lastname: "Pere", phone: "0600000000", email: "groenland@gmail.com", company: "Groenland", comment: "Type un peu louche" }} | ${pcSecurite.general.name} | ${pcSecurite} | ${"Noel"}         | ${"Pere"}        | ${"0600000000"} | ${"groenland@gmail.com"} | ${"Groenland"}  | ${"Type un peu louche"}
  `(
    "when adherent want to add a contractor in $activityName",
    ({
      contractor,
      activity,
      expectedFirstname,
      expectedLastname,
      expectedPhone,
      expectedEmail,
      expectedCompany,
      expectedComment,
    }) => {
      it("should add the contractor", async () => {
        const { inCharge } = await prepareFestivalActivity.addContractor(
          activity.id,
          contractor,
        );

        const expectedId = inCharge.contractors.at(-1)?.id ?? 0 + 1;
        const expectedContractor = {
          id: expectedId,
          firstname: expectedFirstname,
          lastname: expectedLastname,
          phone: expectedPhone,
          email: expectedEmail,
          company: expectedCompany,
          comment: expectedComment,
        };

        expect(inCharge.contractors).toContainEqual(expectedContractor);
      });
    },
  );

  const jeanDupont = escapeGame.inCharge.contractors[0];
  const jeanDupontName = `${jeanDupont.firstname} ${jeanDupont.lastname}`;

  describe.each`
    fields                                      | activityName               | activityId       | contractorName    | contractor    | update
    ${"phone"}                                  | ${escapeGame.general.name} | ${escapeGame.id} | ${jeanDupontName} | ${jeanDupont} | ${{ phone: "0612451729" }}
    ${"email"}                                  | ${escapeGame.general.name} | ${escapeGame.id} | ${jeanDupontName} | ${jeanDupont} | ${{ email: "jean@dupont.fr" }}
    ${"company"}                                | ${escapeGame.general.name} | ${escapeGame.id} | ${jeanDupontName} | ${jeanDupont} | ${{ company: "Auto-Dupont" }}
    ${"comment"}                                | ${escapeGame.general.name} | ${escapeGame.id} | ${jeanDupontName} | ${jeanDupont} | ${{ comment: "Fait des dad jokes" }}
    ${"phone and email"}                        | ${escapeGame.general.name} | ${escapeGame.id} | ${jeanDupontName} | ${jeanDupont} | ${{ phone: "0615372947", email: "jean@dupont.com" }}
    ${"company and lastname"}                   | ${escapeGame.general.name} | ${escapeGame.id} | ${jeanDupontName} | ${jeanDupont} | ${{ company: null, lastname: "De La Porte" }}
    ${"firstname, lastname, company and email"} | ${escapeGame.general.name} | ${escapeGame.id} | ${jeanDupontName} | ${jeanDupont} | ${{ firstname: "Inco", lastname: "Nito", company: null, email: null }}
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

  describe("when adherent want to remove a contractor", () => {
    it("should remove contractor", async () => {
      const contractorToRemove = escapeGame.inCharge.contractors[0];
      const { inCharge } = await prepareFestivalActivity.removeContractor(
        escapeGame.id,
        contractorToRemove.id,
      );

      expect(inCharge.contractors).not.toContainEqual(contractorToRemove);
    });
  });
});
