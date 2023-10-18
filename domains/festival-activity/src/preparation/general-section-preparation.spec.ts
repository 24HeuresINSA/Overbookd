import { beforeEach, describe, expect, it } from "vitest";
import {
  DraftFestivalActivity,
  GeneralSection,
} from "../creation/draft-festival-activity";
import { FestivalActivityFactory } from "../creation/festival-activity.factory";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryFestivalActivityRepository } from "./festival-activity-repository.inmemory";

const noel = {
  id: 1,
  lastname: "Ertsemud",
  firstname: "Noel",
};

const escapeGameGeneral: GeneralSection = {
  name: "Escape Game",
  description: null,
  toPublish: true,
  photoLink: "https://www.google.com",
  isFlagship: true,
  categories: ["Sport"],
  timeWindows: [],
};

describe("General section of festival activity preparation", () => {
  let prepareFestivalActivity: PrepareFestivalActivity;
  let festivalActivityFactory: FestivalActivityFactory;
  let festivalActivityRepository: InMemoryFestivalActivityRepository;
  let escapeGameActivity: DraftFestivalActivity;

  beforeEach(() => {
    festivalActivityFactory = new FestivalActivityFactory();
    const escapeGameCreation = festivalActivityFactory.create({
      name: "Escape Game",
      author: noel,
    });
    escapeGameActivity = DraftFestivalActivity.build({
      ...escapeGameCreation,
      general: escapeGameGeneral,
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
    describe("when adherent want to update name", () => {
      it("should only update name", async () => {
        const nameToUpdate = { name: "Laser game" };

        const { general } = await prepareFestivalActivity.updateGeneralSection(
          escapeGameActivity.id,
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
        } = escapeGameGeneral;

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
          escapeGameActivity.id,
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
        } = escapeGameGeneral;

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
          escapeGameActivity.id,
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
        } = escapeGameGeneral;

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
          escapeGameActivity.id,
          toPublishToUpdate,
        );

        expect(general.toPublish).toEqual(toPublishToUpdate.toPublish);
        expect(general.photoLink).toBe(null);
        expect(general.isFlagship).toBe(false);

        const { name, description, categories, timeWindows } =
          escapeGameGeneral;

        expect(general.name).toBe(name);
        expect(general.description).toBe(description);
        expect(general.categories).toEqual(categories);
        expect(general.timeWindows).toEqual(timeWindows);
      });
    });
  });
});
