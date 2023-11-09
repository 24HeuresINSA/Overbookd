import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import { escapeGame } from "./preparation.test-utils";
import {
  PrepareSignageCreation,
  PrepareSignageUpdate,
} from "./prepare-festival-activity.model";
import { AFFICHE, BACHE, PANNEAU } from "../festival-activity";
import {
  SignageAlreadyExists,
  SignageNotFound,
} from "../festival-activity.error";

describe("Signa section of festival activity preparation", () => {
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

      const expectedSignage = {
        ...signageToAdd,
        id: "affiche-affiche-24-a3",
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

  const panneauEscapeGame = escapeGame.signa.signages[0];
  const bacheEscapeGame = escapeGame.signa.signages[1];

  describe.each`
    fields                                | activityName               | activityId       | signage              | signageId               | update                                                                                                         | expectedId
    ${"comment"}                          | ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame} | ${panneauEscapeGame.id} | ${{ comment: "Ecris blanc sur noir" }}                                                                         | ${undefined}
    ${"quantity"}                         | ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame} | ${panneauEscapeGame.id} | ${{ quantity: 7 }}                                                                                             | ${undefined}
    ${"text"}                             | ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame} | ${panneauEscapeGame.id} | ${{ text: "Bienvenue à l'escape game" }}                                                                       | ${"panneau-bienvenue-a-l-escape-game-4x3"}
    ${"size"}                             | ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame} | ${panneauEscapeGame.id} | ${{ size: "A0" }}                                                                                              | ${"panneau-escape-game-a0"}
    ${"type"}                             | ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame} | ${panneauEscapeGame.id} | ${{ type: BACHE }}                                                                                             | ${"bache-escape-game-4x3"}
    ${"quantity and comment"}             | ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame} | ${panneauEscapeGame.id} | ${{ quantity: 1000, comment: "Je ne sais pas combien il m'en faut" }}                                          | ${undefined}
    ${"text and comment"}                 | ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame} | ${panneauEscapeGame.id} | ${{ text: "L'Xscape Game", comment: "C'est pas une faute, c'est sur le theme Elon Musk" }}                     | ${"panneau-l-xscape-game-4x3"}
    ${"text, size and comment"}           | ${escapeGame.general.name} | ${escapeGame.id} | ${bacheEscapeGame}   | ${bacheEscapeGame.id}   | ${{ text: "L'Xscape Game =>", size: "3 héras", comment: "C'est pas une faute, c'est sur le theme Elon Musk" }} | ${"bache-l-xscape-game-=>-3-heras"}
    ${"quantity, type, size and comment"} | ${escapeGame.general.name} | ${escapeGame.id} | ${bacheEscapeGame}   | ${bacheEscapeGame.id}   | ${{ quantity: 2, type: PANNEAU, size: "2x1 metres", comment: null }}                                           | ${"panneau-bienvenue-2x1-metres"}
  `(
    "when updating $fields from $signageId in $activityName",
    ({ fields, activityId, signage, update, expectedId }) => {
      const shouldAlsoUpdatId = expectedId ? " and contractor id" : "";

      it(`should only update ${fields}${shouldAlsoUpdatId}`, async () => {
        const { signa } = await prepareFestivalActivity.updateSignage(
          activityId,
          { id: signage.id, ...update },
        );
        expect(signa.signages).toContainEqual({
          ...signage,
          ...update,
          id: expectedId ?? signage.id,
        });
      });
    },
  );

  describe("when updating a signage that does not exist", () => {
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

  describe("when updating a signage with data that generate existing id", () => {
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

  describe("when adherent want to remove a signage", () => {
    it("should remove the signage", async () => {
      const signageToRemove = escapeGame.signa.signages[0];

      const { signa } = await prepareFestivalActivity.removeSignage(
        escapeGame.id,
        signageToRemove.id,
      );

      expect(signa.signages).not.toContainEqual(signageToRemove);
    });
  });
});
