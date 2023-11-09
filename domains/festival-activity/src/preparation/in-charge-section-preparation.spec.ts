import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { escapeGame, george, lea } from "./preparation.test-utils";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import { ContractorNotFound } from "../festival-activity.error";

describe("In Charge section of festival activity preparation", () => {
  let prepareFestivalActivity: PrepareFestivalActivity;
  let prepareFestivalActivities: InMemoryPrepareFestivalActivityRepository;

  beforeEach(() => {
    prepareFestivalActivities = new InMemoryPrepareFestivalActivityRepository([
      escapeGame,
    ]);
    prepareFestivalActivity = new PrepareFestivalActivity(
      prepareFestivalActivities,
    );
  });

  describe.each`
    fields                 | activityName               | activityId       | update                                  | adherent                        | team                        | contractors
    ${"adherent"}          | ${escapeGame.general.name} | ${escapeGame.id} | ${{ adherent: lea }}                    | ${lea}                          | ${escapeGame.inCharge.team} | ${escapeGame.inCharge.contractors}
    ${"team"}              | ${escapeGame.general.name} | ${escapeGame.id} | ${{ team: "plaizir" }}                  | ${escapeGame.inCharge.adherent} | ${"plaizir"}                | ${escapeGame.inCharge.contractors}
    ${"adherent and team"} | ${escapeGame.general.name} | ${escapeGame.id} | ${{ team: "Qlture", adherent: george }} | ${george}                       | ${"Qlture"}                 | ${escapeGame.inCharge.contractors}
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

  describe("when adherent want to add a contractor", () => {
    it("should add contractor", async () => {
      const contractorToAdd = {
        firstname: "Lea",
        lastname: "Mouyno",
        phone: "0123456789",
      };
      const { inCharge } = await prepareFestivalActivity.addContractor(
        escapeGame.id,
        contractorToAdd,
      );

      const expectedContractor = {
        ...contractorToAdd,
        id: 2,
        email: null,
        company: null,
        comment: null,
      };

      expect(inCharge.contractors).toContainEqual(expectedContractor);
    });
  });

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
