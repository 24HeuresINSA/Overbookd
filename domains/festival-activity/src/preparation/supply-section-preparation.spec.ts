import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import { escapeGame } from "./preparation.test-utils";
import {
  ElectricitySupplyAlreadyExists,
  ElectricitySupplyNotFound,
} from "../festival-activity.error";
import {
  P17_16A_MONO,
  P17_32A_TETRA,
  PC16_Prise_classique,
} from "../festival-activity";
import {
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
} from "./prepare-festival-activity.model";

describe("Supply section of festival activity preparation", () => {
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

      const expectedElectricitySupply = {
        ...electricitySupplyToAdd,
        id: "ordinateur-p17_16a_mono",
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

  const lumiere = escapeGame.supply.electricity[0];

  describe.each`
    fields                                    | activityName               | activityId       | electricitySupply | supplyId      | update                                                                                              | expectedId
    ${"comment"}                              | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id} | ${{ comment: "Elle doit être JAUUUUNE" }}                                                           | ${undefined}
    ${"connection"}                           | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id} | ${{ connection: PC16_Prise_classique }}                                                             | ${"lumiere-pc16_prise_classique"}
    ${"device"}                               | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id} | ${{ device: "LED" }}                                                                                | ${"led-p17_16a_tetra"}
    ${"power"}                                | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id} | ${{ power: 6 }}                                                                                     | ${undefined}
    ${"count"}                                | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id} | ${{ count: 51 }}                                                                                    | ${undefined}
    ${"connection and comment"}               | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id} | ${{ connection: P17_16A_MONO, comment: "Ça tape for" }}                                             | ${"lumiere-p17_16a_mono"}
    ${"connection and device"}                | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id} | ${{ connection: P17_32A_TETRA, device: "Hallogène" }}                                               | ${"hallogene-p17_32a_tetra"}
    ${"connection, power, count and comment"} | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id} | ${{ connection: PC16_Prise_classique, power: 100, count: 32, comment: "Faut que ça éclaire bien" }} | ${"lumiere-pc16_prise_classique"}
  `(
    "when updating $fields from $supplyId in $activityName",
    ({ fields, activityId, electricitySupply, update, expectedId }) => {
      it(`should only update ${fields}`, async () => {
        const { supply } =
          await prepareFestivalActivity.updateElectricitySupply(activityId, {
            ...update,
            id: electricitySupply.id,
          });

        expect(supply.electricity).toContainEqual({
          ...electricitySupply,
          ...update,
          id: expectedId ?? electricitySupply.id,
        });
      });
    },
  );

  describe("when updating an electricity supply that does not exist", () => {
    it("should indicate that electricity supply does not exist", async () => {
      const electricitySupplyToUpdate = {
        id: "bonjour-p17_16a_tetra",
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

  describe("when updating an electricity supply with data that generate existing id", () => {
    it("should indicate that electricity supply already exists", async () => {
      const electricitySupplyToUpdate: PrepareElectricitySupplyUpdate = {
        id: "lumiere-p17_16a_tetra",
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
