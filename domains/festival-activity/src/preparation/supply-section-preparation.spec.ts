import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import { escapeGame } from "./preparation.test-utils";
import { PrepareElectricitySupplyCreation } from "./prepare-festival-activity.model";
import {
  ElectricitySupplyAlreadyExists,
  ElectricitySupplyNotFound,
} from "../festival-activity.error";

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

  describe("when adherent want to add an electricity supply", () => {
    it("should add the electricity supply", async () => {
      const electricitySupplyToAdd: PrepareElectricitySupplyCreation = {
        connection: "P17_16A_MONO",
        device: "Ordinateur",
        power: 300,
        count: 2,
        comment: null,
      };

      const { supply } = await prepareFestivalActivity.addElectricitySupply(
        escapeGame.id,
        electricitySupplyToAdd,
      );

      const id = "1-ordinateur-p17_16a_mono";
      const expectedElectricitySupply = {
        id,
        ...electricitySupplyToAdd,
      };
      const electricitySupply = supply.electricity.find(
        (electricity) => electricity.id === id,
      );

      expect(electricitySupply).toEqual(expectedElectricitySupply);
    });

    describe("when adherent want to add an electricity supply that already exists", () => {
      it("should indicate that electricity supply already exists", async () => {
        const existingElectricitySupply = escapeGame.supply.electricity[0];

        await expect(
          prepareFestivalActivity.addElectricitySupply(
            escapeGame.id,
            existingElectricitySupply,
          ),
        ).rejects.toThrow(ElectricitySupplyAlreadyExists);
      });
    });
  });

  describe("when adherent want to update an electricity supply", () => {
    it("should update the electricity supply", async () => {
      const electricitySupplyToUpdate = {
        ...escapeGame.supply.electricity[0],
        device: "Ordinateur",
        comment: "Ceci est un commentaire",
      };

      const { supply } = await prepareFestivalActivity.updateElectricitySupply(
        escapeGame.id,
        electricitySupplyToUpdate,
      );

      const id = "1-ordinateur-p17_16a_tetra";
      const expectedElectricitySupply = {
        ...electricitySupplyToUpdate,
        id,
      };

      const electricitySupply = supply.electricity.find(
        (electricity) => electricity.id === id,
      );

      expect(electricitySupply).toEqual(expectedElectricitySupply);
    });

    describe("when adherent want to update an electricity supply that does not exist", () => {
      it("should indicate that electricity supply does not exist", async () => {
        const electricitySupplyToUpdate = {
          ...escapeGame.supply.electricity[0],
          id: "1-bonjour-p17_16a_tetra",
        };

        await expect(
          prepareFestivalActivity.updateElectricitySupply(
            escapeGame.id,
            electricitySupplyToUpdate,
          ),
        ).rejects.toThrow(ElectricitySupplyNotFound);
      });
    });
  });

  describe("when adherent want to remove an electricity supply", () => {
    it("should remove the electricity supply", async () => {
      const electricitySupplyId = "1-lumiere-p17_16a_tetra";

      const { supply } = await prepareFestivalActivity.removeElectricitySupply(
        escapeGame.id,
        electricitySupplyId,
      );

      const electricitySupply = supply.electricity.find(
        (electricity) => electricity.id === electricitySupplyId,
      );

      expect(electricitySupply).toBeUndefined();
    });
  });
});
