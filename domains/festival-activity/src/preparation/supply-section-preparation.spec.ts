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
    describe("when adherent want to update water supply", () => {
      it("should only update water", async () => {
        const updateWater = { water: "Jet d'eau" };

        const { supply } = await prepareFestivalActivity.updateSupplySection(
          escapeGame.id,
          updateWater,
        );

        expect(supply.water).toBe(updateWater.water);
        expect(supply.electricity).toEqual(escapeGame.supply.electricity);
      });
    });
  });
});
