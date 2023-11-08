import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import { escapeGame } from "./preparation.test-utils";
import {
  ElectricitySupplyAlreadyExists,
  ElectricitySupplyNotFound,
} from "../festival-activity.error";
import { P17_16A_MONO, P17_32A_TETRA } from "../festival-activity";
import {
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
} from "./prepare-festival-activity.model";

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
        connection: P17_16A_MONO,
        device: "Ordinateur",
        power: 300,
        count: 2,
      };

      const { supply } = await prepareFestivalActivity.addElectricitySupply(
        escapeGame.id,
        electricitySupplyToAdd,
      );

      const id = "1-ordinateur-p17_16a_mono";
      const expectedElectricitySupply = {
        id,
        ...electricitySupplyToAdd,
        comment: null,
      };

      expect(supply.electricity).toContainEqual(expectedElectricitySupply);
    });

    describe("when adherent want to add an electricity supply that already exists", () => {
      it("should indicate that electricity supply already exists", async () => {
        const existingElectricitySupply = escapeGame.supply.electricity[0];
        const electricitySupplyToAdd = {
          connection: existingElectricitySupply.connection,
          device: existingElectricitySupply.device,
          power: existingElectricitySupply.power,
          count: existingElectricitySupply.count,
        };

        await expect(
          prepareFestivalActivity.addElectricitySupply(
            escapeGame.id,
            electricitySupplyToAdd,
          ),
        ).rejects.toThrow(ElectricitySupplyAlreadyExists);
      });
    });
  });

  describe("when adherent want to update an electricity supply", () => {
    it("should update the electricity supply", async () => {
      const electricitySupplyToUpdate = escapeGame.supply.electricity[0];
      const updatedelectricitySupply = {
        id: electricitySupplyToUpdate.id,
        device: "Ordinateur",
        comment: null,
      };

      const { supply } = await prepareFestivalActivity.updateElectricitySupply(
        escapeGame.id,
        updatedelectricitySupply,
      );

      const id = "1-ordinateur-p17_16a_tetra";
      const expectedElectricitySupply = {
        ...electricitySupplyToUpdate,
        ...updatedelectricitySupply,
        id,
      };

      expect(supply.electricity).toContainEqual(expectedElectricitySupply);
    });

    describe("when adherent want to update an electricity supply that does not exist", () => {
      it("should indicate that electricity supply does not exist", async () => {
        const electricitySupplyToUpdate = {
          id: "1-bonjour-p17_16a_tetra",
          comment: "Ceci est un commentaire",
        };

        await expect(
          prepareFestivalActivity.updateElectricitySupply(
            escapeGame.id,
            electricitySupplyToUpdate,
          ),
        ).rejects.toThrow(ElectricitySupplyNotFound);
      });
    });

    describe("when adherent want to update an electricity supply with data that generate existing id", () => {
      it("should indicate that electricity supply already exists", async () => {
        const electricitySupplyToUpdate: PrepareElectricitySupplyUpdate = {
          id: "1-lumiere-p17_16a_tetra",
          device: "Enceinte",
          connection: P17_32A_TETRA,
        };

        await expect(
          prepareFestivalActivity.updateElectricitySupply(
            escapeGame.id,
            electricitySupplyToUpdate,
          ),
        ).rejects.toThrow(ElectricitySupplyAlreadyExists);
      });
    });
  });

  describe("when adherent want to remove an electricity supply", () => {
    it("should remove the electricity supply", async () => {
      const electricitySupplyToRemove = escapeGame.supply.electricity[0];

      const { supply } = await prepareFestivalActivity.removeElectricitySupply(
        escapeGame.id,
        electricitySupplyToRemove.id,
      );

      expect(supply.electricity).not.toContainEqual(electricitySupplyToRemove);
    });
  });
});
