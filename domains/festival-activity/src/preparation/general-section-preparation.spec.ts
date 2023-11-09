import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { TimeWindowAlreadyExists } from "../festival-activity.error";
import { Duration, EndBeforeStart } from "@overbookd/period";
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

  describe.each`
    fields                                                       | activityName               | activityId       | update                                                                                                                                                           | name                       | description                       | categories                       | toPublish                       | photoLink                         | isFlagship                       | timeWindows
    ${"name"}                                                    | ${escapeGame.general.name} | ${escapeGame.id} | ${{ name: "Laser Game" }}                                                                                                                                        | ${"Laser Game"}            | ${escapeGame.general.description} | ${escapeGame.general.categories} | ${escapeGame.general.toPublish} | ${escapeGame.general.photoLink}   | ${escapeGame.general.isFlagship} | ${escapeGame.general.timeWindows}
    ${"description"}                                             | ${escapeGame.general.name} | ${escapeGame.id} | ${{ description: "Trouve la sortie" }}                                                                                                                           | ${escapeGame.general.name} | ${"Trouve la sortie"}             | ${escapeGame.general.categories} | ${escapeGame.general.toPublish} | ${escapeGame.general.photoLink}   | ${escapeGame.general.isFlagship} | ${escapeGame.general.timeWindows}
    ${"categories"}                                              | ${escapeGame.general.name} | ${escapeGame.id} | ${{ categories: ["Culture", "Sport"] }}                                                                                                                          | ${escapeGame.general.name} | ${escapeGame.general.description} | ${["Culture", "Sport"]}          | ${escapeGame.general.toPublish} | ${escapeGame.general.photoLink}   | ${escapeGame.general.isFlagship} | ${escapeGame.general.timeWindows}
    ${"photoLink"}                                               | ${escapeGame.general.name} | ${escapeGame.id} | ${{ photoLink: "https://instagram.com/123456" }}                                                                                                                 | ${escapeGame.general.name} | ${escapeGame.general.description} | ${escapeGame.general.categories} | ${escapeGame.general.toPublish} | ${"https://instagram.com/123456"} | ${escapeGame.general.isFlagship} | ${escapeGame.general.timeWindows}
    ${"isFlagship"}                                              | ${escapeGame.general.name} | ${escapeGame.id} | ${{ isFlagship: false }}                                                                                                                                         | ${escapeGame.general.name} | ${escapeGame.general.description} | ${escapeGame.general.categories} | ${escapeGame.general.toPublish} | ${escapeGame.general.photoLink}   | ${false}                         | ${escapeGame.general.timeWindows}
    ${"name and description"}                                    | ${escapeGame.general.name} | ${escapeGame.id} | ${{ name: "Nuit de la Qlture", description: "Montre comment tu es culturé" }}                                                                                    | ${"Nuit de la Qlture"}     | ${"Montre comment tu es culturé"} | ${escapeGame.general.categories} | ${escapeGame.general.toPublish} | ${escapeGame.general.photoLink}   | ${escapeGame.general.isFlagship} | ${escapeGame.general.timeWindows}
    ${"categories, isFlagship and photoLink"}                    | ${escapeGame.general.name} | ${escapeGame.id} | ${{ categories: ["Sport", "Enfant"], photoLink: "https://pinterest.com/12345", isFlagship: false }}                                                              | ${escapeGame.general.name} | ${escapeGame.general.description} | ${["Sport", "Enfant"]}           | ${escapeGame.general.toPublish} | ${"https://pinterest.com/12345"}  | ${false}                         | ${escapeGame.general.timeWindows}
    ${"name, description, categories, isFlagship and photoLink"} | ${escapeGame.general.name} | ${escapeGame.id} | ${{ name: "Lancer de haches", description: "Réveille le Viking", categories: ["Sport", "Enfant"], photoLink: "https://pinterest.com/12345", isFlagship: false }} | ${"Lancer de haches"}      | ${"Réveille le Viking"}           | ${["Sport", "Enfant"]}           | ${escapeGame.general.toPublish} | ${"https://pinterest.com/12345"}  | ${false}                         | ${escapeGame.general.timeWindows}
  `(
    "when updating $fields from $activityName",
    ({
      fields,
      activityId,
      update,
      name,
      description,
      categories,
      toPublish,
      photoLink,
      isFlagship,
      timeWindows,
    }) => {
      it(`should only update ${fields}`, async () => {
        const { general } = await prepareFestivalActivity.updateGeneralSection(
          activityId,
          update,
        );

        expect(general.name).toBe(name);
        expect(general.description).toBe(description);
        expect(general.categories).toEqual(categories);
        expect(general.toPublish).toBe(toPublish);
        expect(general.photoLink).toBe(photoLink);
        expect(general.isFlagship).toBe(isFlagship);
        expect(general.timeWindows).toEqual(timeWindows);
      });
    },
  );

  describe("when setting activity as private", () => {
    it("should reset photolink and isFlagship", async () => {
      const update = { toPublish: false };

      const { general } = await prepareFestivalActivity.updateGeneralSection(
        escapeGame.id,
        update,
      );

      expect(general.isFlagship).toBe(false);
      expect(general.photoLink).toBe(null);
      expect(general.isFlagship).toBe(false);
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
    it("should add the time window", async () => {
      const timeWindowToAdd = {
        start: new Date("2023-05-17T08:00+02:00"),
        end: new Date("2023-05-17T09:00+02:00"),
      };

      const { general } = await prepareFestivalActivity.addTimeWindowInGeneral(
        escapeGame.id,
        timeWindowToAdd,
      );

      const startDuration = Duration.ms(timeWindowToAdd.start.getTime());
      const endDuration = Duration.ms(timeWindowToAdd.end.getTime());
      const id = `${startDuration.inMinutes}-${endDuration.inMinutes}`;

      const expectedTimeWindow = { ...timeWindowToAdd, id };

      expect(general.timeWindows).toContainEqual(expectedTimeWindow);
    });

    describe("when adherent want to add a time window that already exists", () => {
      it("should should indicate that the time window already exists", async () => {
        const existingTimeWindow = escapeGame.general.timeWindows[0];

        await expect(
          prepareFestivalActivity.addTimeWindowInGeneral(
            escapeGame.id,
            existingTimeWindow,
          ),
        ).rejects.toThrow(TimeWindowAlreadyExists);
      });
    });

    describe("when adherent want to add a time window with end before start", () => {
      it("should should indicate that end should be after start", async () => {
        const invalidTimeWindow = {
          start: new Date("2023-05-17T09:00+02:00"),
          end: new Date("2023-05-17T08:00+02:00"),
        };

        await expect(
          prepareFestivalActivity.addTimeWindowInGeneral(
            escapeGame.id,
            invalidTimeWindow,
          ),
        ).rejects.toThrow(EndBeforeStart);
      });
    });
  });

  describe("when adherent want to remove a time window", () => {
    it("should remove the time window", async () => {
      const timeWindowToRemove = escapeGame.general.timeWindows[0];

      const { general } =
        await prepareFestivalActivity.removeTimeWindowFromGeneral(
          escapeGame.id,
          timeWindowToRemove.id,
        );

      expect(general.timeWindows).not.toContainEqual(timeWindowToRemove);
    });
  });
});
