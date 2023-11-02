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
        const updateAdherent = { adherentId: lea.id };

        const { inCharge } =
          await prepareFestivalActivity.updateInChargeSection(
            escapeGame.id,
            updateAdherent,
          );

        expect(inCharge.adherent.id).toBe(updateAdherent.adherentId);

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
        const updateAdherent = { adherentId: lea.id };
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

        expect(inCharge.adherent).toBe(lea);
        expect(inCharge.team).toBe(updateTeam.team);
      });
    });
  });
});
