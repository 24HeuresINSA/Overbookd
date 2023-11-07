import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import { escapeGame } from "./preparation.test-utils";
import {
  PrepareSignageCreation,
  PrepareSignageUpdate,
} from "./prepare-festival-activity.model";
import { AFFICHE, BACHE } from "../festival-activity";
import {
  SignageAlreadyExists,
  SignageNotFound,
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
    describe("when adherent want to update location", () => {
      it("should only update location", async () => {
        const updateLocation = { location: "Derrière TC" };

        const { signa } = await prepareFestivalActivity.updateSignaSection(
          escapeGame.id,
          updateLocation,
        );

        expect(signa.location).toBe(updateLocation.location);
        expect(signa.signages).toEqual(escapeGame.signa.signages);
      });
    });
  });

  describe("when adherent want to add a signage", () => {
    it("should add the signage", async () => {
      const signageToAdd: PrepareSignageCreation = {
        text: "Affiche 24",
        size: "A3",
        type: AFFICHE,
        quantity: 10,
      };

      const { signa } = await prepareFestivalActivity.addSignage(
        escapeGame.id,
        signageToAdd,
      );

      const id = "affiche-affiche-24-a3";
      const expectedSignage = {
        id,
        ...signageToAdd,
        comment: null,
      };

      expect(signa.signages).toContainEqual(expectedSignage);
    });

    describe("when adherent want to add a signage that already exists", () => {
      it("should indicate that signage already exists", async () => {
        const existingSignage = escapeGame.signa.signages[0];
        const signageToAdd = {
          text: existingSignage.text,
          type: existingSignage.type,
          size: existingSignage.size,
          quantity: existingSignage.quantity,
        };

        await expect(
          prepareFestivalActivity.addSignage(escapeGame.id, signageToAdd),
        ).rejects.toThrow(SignageAlreadyExists);
      });
    });
  });

  describe("when adherent want to update a signage", () => {
    it("should update the signage", async () => {
      const signageToUpdate = escapeGame.signa.signages[0];
      const updatedSignage = {
        id: signageToUpdate.id,
        text: "Bienvenue à l'Escape Game",
        comment: "Ecris blanc sur noir",
      };

      const { signa } = await prepareFestivalActivity.updateSignage(
        escapeGame.id,
        updatedSignage,
      );

      const id = "panneau-bienvenue-a-l-escape-game-4x3";
      const expectedSignage = {
        ...signageToUpdate,
        ...updatedSignage,
        id,
      };

      expect(signa.signages).toContainEqual(expectedSignage);
    });

    describe("when adherent want to update a signage that does not exist", () => {
      it("should indicate that signage does not exist", async () => {
        const signageToUpdate = {
          id: "bache-le-panneau-qui-n-existe-pas-a4",
          comment: "Oui",
        };

        await expect(
          prepareFestivalActivity.updateSignage(escapeGame.id, signageToUpdate),
        ).rejects.toThrow(SignageNotFound);
      });
    });

    describe("when adherent want to update a signage with data that generate existing id", () => {
      it("should indicate that signage already exists", async () => {
        const signageToUpdate: PrepareSignageUpdate = {
          id: escapeGame.signa.signages[0].id,
          text: "Bienvenue",
          size: "10m par 2m",
          type: BACHE,
        };

        await expect(
          prepareFestivalActivity.updateSignage(escapeGame.id, signageToUpdate),
        ).rejects.toThrow(SignageAlreadyExists);
      });
    });
  });

  describe("when adherent want to remove a signage", () => {
    it("should remove the signage", async () => {
      const signageId = escapeGame.signa.signages[0].id;

      const { signa } = await prepareFestivalActivity.removeSignage(
        escapeGame.id,
        signageId,
      );
      const signage = signa.signages.find((s) => s.id === signageId);

      expect(signage).toBeUndefined();
    });
  });
});
