import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { escapeGame, lea } from "./preparation.test-utils";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";

describe("General section of festival activity preparation", () => {
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

  describe("when adherent want to update a field", () => {
    describe("when adherent want to update adherent in charge", () => {
      it("should only update adherent", async () => {
        const updateAdherent = { adherent: lea };

        const { inCharge } =
          await prepareFestivalActivity.updateInChargeSection(
            escapeGame.id,
            updateAdherent,
          );

        expect(inCharge.adherent).toEqual(updateAdherent.adherent);

        const { team, contractors } = escapeGame.inCharge;

        expect(inCharge.team).toBe(team);
        expect(inCharge.contractors).toEqual(contractors);
      });
    });

    describe("when adherent want to update team in charge", () => {
      it("should only update team", async () => {
        const updateTeam = { team: "plaizir" };

        const { inCharge } =
          await prepareFestivalActivity.updateInChargeSection(
            escapeGame.id,
            updateTeam,
          );

        expect(inCharge.team).toBe(updateTeam.team);

        const { adherent, contractors } = escapeGame.inCharge;

        expect(inCharge.adherent).toBe(adherent);
        expect(inCharge.contractors).toEqual(contractors);
      });
    });
  });

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

      const id = "1-2";
      const expectedContractor = {
        id,
        ...contractorToAdd,
        email: null,
        company: null,
        comment: null,
      };
      const contractor = inCharge.contractors.find(
        (contractor) => contractor.id === id,
      );

      expect(contractor).toEqual(expectedContractor);
    });
  });

  describe("when adherent want to update a contractor", () => {
    it("should update contractor", async () => {
      const contractorToUpdate = {
        id: "1-1",
        firstname: "Noel",
        lastname: "Mouyno",
        phone: "0123456789",
        email: "noel@gmail.com",
        company: "SNCF",
        comment: null,
      };
      const { inCharge } = await prepareFestivalActivity.updateContractor(
        escapeGame.id,
        contractorToUpdate,
      );

      const contractor = inCharge.contractors.find(
        (contractor) => contractor.id === contractorToUpdate.id,
      );

      expect(contractor).toEqual(contractorToUpdate);
    });
  });

  describe("when adherent want to remove a contractor", () => {
    it("should remove contractor", async () => {
      const contractorId = "1-1";
      const { inCharge } = await prepareFestivalActivity.removeContractor(
        escapeGame.id,
        contractorId,
      );

      const contractor = inCharge.contractors.find(
        (contractor) => contractor.id === contractorId,
      );

      expect(contractor).toBeUndefined();
    });
  });
});
