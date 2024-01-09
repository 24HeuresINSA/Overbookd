import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import {
  escapeGame,
  justDance,
  validatedByElec,
} from "./preparation.test-utils";
import {
  ElectricitySupplyAlreadyExists,
  ElectricitySupplyNotFound,
} from "../festival-activity.error";
import {
  P17_16A_MONO,
  P17_16A_TETRA,
  P17_32A_TETRA,
  PC16_Prise_classique,
} from "../sections/supply";
import { PrepareElectricitySupplyUpdate } from "./prepare-festival-activity.model";
import { elec } from "../sections/reviews";
import { PrepareError } from "./prepare-in-review-festival-activity";
import { nintendoSwitchSupply } from "../festival-activity.fake";

describe("Supply section of festival activity preparation", () => {
  let prepareFestivalActivity: PrepareFestivalActivity;
  let prepareFestivalActivities: InMemoryPrepareFestivalActivityRepository;

  beforeEach(() => {
    prepareFestivalActivities = new InMemoryPrepareFestivalActivityRepository([
      escapeGame,
      justDance,
      validatedByElec,
    ]);
    prepareFestivalActivity = new PrepareFestivalActivity(
      prepareFestivalActivities,
    );
  });

  describe("when adherent want to update a field", () => {
    describe.each`
      activityName               | activity      | update                    | expectedWater
      ${escapeGame.general.name} | ${escapeGame} | ${{ water: "Jet d'eau" }} | ${"Jet d'eau"}
      ${justDance.general.name}  | ${justDance}  | ${{ water: null }}        | ${null}
    `(
      "when updating water from $activityName",
      ({ activity, update, expectedWater }) => {
        it("should only update water", async () => {
          const { supply } = await prepareFestivalActivity.updateSupplySection(
            activity.id,
            update,
          );

          expect(supply.water).toBe(expectedWater);
          expect(supply.electricity).toEqual(activity.supply.electricity);
        });
      },
    );
  });

  describe("when adherent want to add an electricity supply", () => {
    describe.each`
      activityName               | activityId       | newSupply                                                                                                           | expectedId
      ${escapeGame.general.name} | ${escapeGame.id} | ${{ connection: P17_16A_MONO, power: 200, device: "tronçonneuse", count: 2, comment: "Juste pour faire peur tkt" }} | ${"tronconneuse-p17_16a_mono"}
      ${escapeGame.general.name} | ${escapeGame.id} | ${{ connection: P17_16A_TETRA, power: 50, device: "spot", count: 4 }}                                               | ${"spot-p17_16a_tetra"}
      ${justDance.general.name}  | ${justDance.id}  | ${{ connection: PC16_Prise_classique, power: 200, device: "boule du fun", count: 2 }}                               | ${"boule-du-fun-pc16_prise_classique"}
    `(
      "when adding electricity supply in $activityName",
      ({ activityId, newSupply, expectedId }) => {
        it("should add electricity supply", async () => {
          const { supply } = await prepareFestivalActivity.addElectricitySupply(
            activityId,
            newSupply,
          );
          const expectedSupply = {
            ...newSupply,
            comment: newSupply.comment ?? null,
            id: expectedId,
          };

          expect(supply.electricity).toContainEqual(expectedSupply);
        });
      },
    );

    describe.each`
      activityName               | activityId       | newSupply
      ${escapeGame.general.name} | ${escapeGame.id} | ${escapeGame.supply.electricity[0]}
      ${justDance.general.name}  | ${justDance.id}  | ${justDance.supply.electricity[0]}
    `(
      "when adding again electricity supply on $activityName",
      ({ activityId, newSupply }) => {
        it("should indicate that electricity supply already exists", async () => {
          const { id, ...rest } = newSupply;

          expect(
            async () =>
              await prepareFestivalActivity.addElectricitySupply(
                activityId,
                rest,
              ),
          ).rejects.toThrow(ElectricitySupplyAlreadyExists);
        });
      },
    );
  });

  const lumiere = escapeGame.supply.electricity[0];
  const nintendo = justDance.supply.electricity[0];

  describe.each`
    fields                                    | activityName               | activityId       | electricitySupply | supplyId       | update                                                                                              | expectedId
    ${"comment"}                              | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id}  | ${{ comment: "Elle doit être JAUUUUNE" }}                                                           | ${undefined}
    ${"comment"}                              | ${justDance.general.name}  | ${justDance.id}  | ${nintendo}       | ${nintendo.id} | ${{ comment: "Pour brancher la switch et la manette" }}                                             | ${undefined}
    ${"connection"}                           | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id}  | ${{ connection: PC16_Prise_classique }}                                                             | ${"lumiere-pc16_prise_classique"}
    ${"connection"}                           | ${justDance.general.name}  | ${justDance.id}  | ${nintendo}       | ${nintendo.id} | ${{ connection: P17_16A_MONO }}                                                                     | ${"nintendo-switch-p17_16a_mono"}
    ${"device"}                               | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id}  | ${{ device: "LED" }}                                                                                | ${"led-p17_16a_tetra"}
    ${"device"}                               | ${justDance.general.name}  | ${justDance.id}  | ${nintendo}       | ${nintendo.id} | ${{ device: "PS5" }}                                                                                | ${"ps5-pc16_prise_classique"}
    ${"power"}                                | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id}  | ${{ power: 6 }}                                                                                     | ${undefined}
    ${"count"}                                | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id}  | ${{ count: 51 }}                                                                                    | ${undefined}
    ${"connection and comment"}               | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id}  | ${{ connection: P17_16A_MONO, comment: "Ça tape for" }}                                             | ${"lumiere-p17_16a_mono"}
    ${"connection and device"}                | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id}  | ${{ connection: P17_32A_TETRA, device: "Hallogène" }}                                               | ${"hallogene-p17_32a_tetra"}
    ${"connection and device"}                | ${justDance.general.name}  | ${justDance.id}  | ${nintendo}       | ${nintendo.id} | ${{ connection: P17_32A_TETRA, device: "PS5" }}                                                     | ${"ps5-p17_32a_tetra"}
    ${"connection, power, count and comment"} | ${escapeGame.general.name} | ${escapeGame.id} | ${lumiere}        | ${lumiere.id}  | ${{ connection: PC16_Prise_classique, power: 100, count: 32, comment: "Faut que ça éclaire bien" }} | ${"lumiere-pc16_prise_classique"}
    ${"connection, power, count and comment"} | ${justDance.general.name}  | ${justDance.id}  | ${nintendo}       | ${nintendo.id} | ${{ connection: P17_16A_MONO, power: 100, count: 2, comment: null }}                                | ${"nintendo-switch-p17_16a_mono"}
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

  describe("when adherent want to remove an electricity supply", () => {
    describe.each`
      activityName               | activityId       | supplyId
      ${escapeGame.general.name} | ${escapeGame.id} | ${escapeGame.supply.electricity[0].id}
      ${escapeGame.general.name} | ${escapeGame.id} | ${escapeGame.supply.electricity[1].id}
      ${justDance.general.name}  | ${justDance.id}  | ${escapeGame.supply.electricity[0].id}
    `(
      "when removing electricity supply from $activityName",
      ({ activityId, request, supplyId }) => {
        it("should remove the electricity supply", async () => {
          const { supply } =
            await prepareFestivalActivity.removeElectricitySupply(
              activityId,
              supplyId,
            );

          expect(supply.electricity).not.toContainEqual(request);
        });
      },
    );
  });

  describe(`when ${validatedByElec.general.name} is already validated by ${elec}`, () => {
    describe("when trying to update water", () => {
      it("should indicate that supply section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.updateSupplySection(
              validatedByElec.id,
              { water: "2 robinets d'eau potable" },
            ),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
    describe("when trying to add an electricity supply", () => {
      it("should indicate that supply section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.addElectricitySupply(
              validatedByElec.id,
              { ...nintendoSwitchSupply, comment: "Première Gen" },
            ),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
    describe("when trying to update an electricity supply", () => {
      it("should indicate that supply section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.updateElectricitySupply(
              validatedByElec.id,
              { id: lumiere.id, power: 10 },
            ),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
    describe("when trying to remove an electricity supply", () => {
      it("should indicate that supply section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.removeElectricitySupply(
              validatedByElec.id,
              lumiere.id,
            ),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
  });
});
