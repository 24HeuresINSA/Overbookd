import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { TIME_WINDOW_ALREADY_EXISTS_ERROR_MESSAGE } from "../festival-activity.error";
import { Period } from "@overbookd/period";
import { Duration } from "@overbookd/period";
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
    describe("when adherent want to update name", () => {
      it("should only update name", async () => {
        const nameToUpdate = { name: "Laser game" };

        const { general } = await prepareFestivalActivity.updateGeneralSection(
          escapeGame.id,
          nameToUpdate,
        );

        expect(general.name).toBe(nameToUpdate.name);

        const {
          description,
          categories,
          toPublish,
          photoLink,
          isFlagship,
          timeWindows,
        } = escapeGame.general;

        expect(general.description).toBe(description);
        expect(general.categories).toEqual(categories);
        expect(general.toPublish).toBe(toPublish);
        expect(general.photoLink).toBe(photoLink);
        expect(general.isFlagship).toBe(isFlagship);
        expect(general.timeWindows).toEqual(timeWindows);
      });
    });

    describe("when adherent want to update description", () => {
      it("should only update description", async () => {
        const descriptionToUpdate = { description: "Tire sur les cibles" };

        const { general } = await prepareFestivalActivity.updateGeneralSection(
          escapeGame.id,
          descriptionToUpdate,
        );

        expect(general.description).toBe(descriptionToUpdate.description);

        const {
          name,
          categories,
          toPublish,
          photoLink,
          isFlagship,
          timeWindows,
        } = escapeGame.general;

        expect(general.name).toBe(name);
        expect(general.categories).toEqual(categories);
        expect(general.toPublish).toBe(toPublish);
        expect(general.photoLink).toBe(photoLink);
        expect(general.isFlagship).toBe(isFlagship);
        expect(general.timeWindows).toEqual(timeWindows);
      });
    });

    describe("when adherent want to update categories", () => {
      it("should only update categories", async () => {
        const categoriesToUpdate = { categories: ["Culture", "Sport"] };

        const { general } = await prepareFestivalActivity.updateGeneralSection(
          escapeGame.id,
          categoriesToUpdate,
        );

        expect(general.categories).toEqual(categoriesToUpdate.categories);

        const {
          name,
          description,
          toPublish,
          photoLink,
          isFlagship,
          timeWindows,
        } = escapeGame.general;

        expect(general.name).toBe(name);
        expect(general.description).toBe(description);
        expect(general.toPublish).toBe(toPublish);
        expect(general.photoLink).toBe(photoLink);
        expect(general.isFlagship).toBe(isFlagship);
        expect(general.timeWindows).toEqual(timeWindows);
      });
    });

    describe("when adherent want to update festival activity publication status", () => {
      it("should set toPublish to false and clean publication values", async () => {
        const toPublishToUpdate = { toPublish: false };

        const { general } = await prepareFestivalActivity.updateGeneralSection(
          escapeGame.id,
          toPublishToUpdate,
        );

        expect(general.toPublish).toEqual(toPublishToUpdate.toPublish);
        expect(general.photoLink).toBe(null);
        expect(general.isFlagship).toBe(false);

        const { name, description, categories, timeWindows } =
          escapeGame.general;

        expect(general.name).toBe(name);
        expect(general.description).toBe(description);
        expect(general.categories).toEqual(categories);
        expect(general.timeWindows).toEqual(timeWindows);
      });
    });
  });

  describe("when adherent want to update multiple fields consecutively", () => {
    describe("when adherent want to update name then description in 2 times", () => {
      it("should update both name and description", async () => {
        const updateName = { name: "Laser game" };
        const updateDescription = {
          description: "Tire sur les gens avec un pistolet laser",
        };

        await prepareFestivalActivity.updateGeneralSection(
          escapeGame.id,
          updateName,
        );

        const { general } = await prepareFestivalActivity.updateGeneralSection(
          escapeGame.id,
          updateDescription,
        );

        expect(general.name).toBe(updateName.name);
        expect(general.description).toBe(updateDescription.description);
      });
    });
  });

  describe("when adherent want to add a time window", () => {
    const timeWindowToAdd = Period.init({
      start: new Date("2023-05-17 08:00"),
      end: new Date("2023-05-17 09:00"),
    });

    it("should add the time window", async () => {
      const { general } = await prepareFestivalActivity.addTimeWindowInGeneral(
        escapeGame.id,
        timeWindowToAdd,
      );

      const startDuration = Duration.ms(timeWindowToAdd.start.getTime());
      const endDuration = Duration.ms(timeWindowToAdd.end.getTime());
      const timeWindowId = `${escapeGame.id}-${startDuration.inMinutes}-${endDuration.inMinutes}`;

      const timeWindow = general.timeWindows.find(
        (tw) => tw.id === timeWindowId,
      );

      expect(timeWindow?.id).toEqual(timeWindowId);
      expect(timeWindow?.start).toEqual(timeWindowToAdd.start);
      expect(timeWindow?.end).toEqual(timeWindowToAdd.end);
    });

    describe("when adherent want to add a time window that already exists", () => {
      it("should should indicate that the time window already exists", async () => {
        await prepareFestivalActivity.addTimeWindowInGeneral(
          escapeGame.id,
          timeWindowToAdd,
        );

        await expect(
          prepareFestivalActivity.addTimeWindowInGeneral(
            escapeGame.id,
            timeWindowToAdd,
          ),
        ).rejects.toThrow(TIME_WINDOW_ALREADY_EXISTS_ERROR_MESSAGE);
      });
    });
  });

  describe("when adherent want to remove a time window", () => {
    it("should remove the time window", async () => {
      const timeWindowToAdd = {
        start: new Date("2023-05-17 09:00"),
        end: new Date("2023-05-17 14:00"),
      };

      await prepareFestivalActivity.addTimeWindowInGeneral(
        escapeGame.id,
        timeWindowToAdd,
      );

      const startDuration = Duration.ms(timeWindowToAdd.start.getTime());
      const endDuration = Duration.ms(timeWindowToAdd.end.getTime());
      const timeWindowId = `${escapeGame.id}-${startDuration.inMinutes}-${endDuration.inMinutes}`;

      const { general } =
        await prepareFestivalActivity.removeTimeWindowFromGeneral(
          escapeGame.id,
          timeWindowId,
        );

      const timeWindow = general.timeWindows.find(
        (tw) => tw.id === timeWindowId,
      );
      expect(timeWindow).toBeUndefined();
    });
  });
});
