import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { escapeGame, lea } from "./preparation.test-utils";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import { ContractorNotFound } from "../festival-activity.error";

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

  describe("when adherent want to update a contractor", () => {
    describe("when adherent want to update all fields of a contractor", () => {
      it("should update all fields of contractor", async () => {
        const contractorToUpdate = {
          id: 1,
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

        expect(inCharge.contractors).toContainEqual(contractorToUpdate);
      });
    });

    describe("when adherent want to update firstname, phone and comment of a contractor", () => {
      it("should update firstname, phone and comment of contractor", async () => {
        const contractorToUpdate = escapeGame.inCharge.contractors[0];
        const updatedContractor = {
          id: 1,
          firstname: "Patrick",
          phone: "0111111111",
          comment: "J'adore ce mec",
        };
        const { inCharge } = await prepareFestivalActivity.updateContractor(
          escapeGame.id,
          updatedContractor,
        );
        const expectedContractor = {
          ...contractorToUpdate,
          ...updatedContractor,
        };

        expect(inCharge.contractors).toContainEqual(expectedContractor);
      });
    });

    describe("when adherent want to update a contractor that does not exist", () => {
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
