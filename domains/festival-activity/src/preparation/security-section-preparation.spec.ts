import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import { escapeGame } from "./preparation.test-utils";

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
    describe("when adherent want to update special need", () => {
      it("should update special need", async () => {
        const updateSecurity = { specialNeed: "Un vigil à l'entrée" };

        const { security } =
          await prepareFestivalActivity.updateSecuritySection(
            escapeGame.id,
            updateSecurity,
          );

        expect(security.specialNeed).toBe(updateSecurity.specialNeed);
      });
    });
  });
});
