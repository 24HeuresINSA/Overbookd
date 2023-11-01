import { beforeEach, describe, expect, it } from "vitest";
import { DraftFestivalActivity } from "../draft-festival-activity";
import { FestivalActivityCreation } from "../creation/creation";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryFestivalActivityRepository } from "../festival-activity-repository.inmemory";
import { SupplySection } from "../festival-activity.core";

const noel = {
  id: 1,
  lastname: "Ertsemud",
  firstname: "Noel",
};

const escapeGameSupply: SupplySection = {
  electricity: [],
  water: null,
};

describe("General section of festival activity preparation", () => {
  let prepareFestivalActivity: PrepareFestivalActivity;
  let festivalActivityFactory: FestivalActivityCreation;
  let festivalActivityRepository: InMemoryFestivalActivityRepository;
  let escapeGameActivity: DraftFestivalActivity;

  beforeEach(() => {
    festivalActivityFactory = new FestivalActivityCreation();
    const escapeGameCreation = festivalActivityFactory.create({
      name: "Escape Game",
      author: noel,
    });
    escapeGameActivity = DraftFestivalActivity.build({
      ...escapeGameCreation,
      supply: escapeGameSupply,
    });
    const festivalActivities = [escapeGameActivity];

    festivalActivityRepository = new InMemoryFestivalActivityRepository(
      festivalActivities,
    );
    prepareFestivalActivity = new PrepareFestivalActivity(
      festivalActivityRepository,
    );
  });

  describe("when adherent want to update a field", () => {
    describe("when adherent want to update water supply", () => {
      it("should only update water", async () => {
        const updateWater = { water: "Jet d'eau" };

        const { supply } = await prepareFestivalActivity.updateSupplySection(
          escapeGameActivity.id,
          updateWater,
        );

        expect(supply.water).toBe(updateWater.water);
        expect(supply.electricity).toEqual(escapeGameSupply.electricity);
      });
    });
  });
});
