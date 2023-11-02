import { beforeEach, describe, expect, it } from "vitest";
import { DraftFestivalActivity } from "./draft-festival-activity";
import { CreateFestivalActivity } from "../creation/creation";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryFestivalActivityRepository } from "../festival-activity-repository.inmemory";
import { SignaSection } from "../festival-activity";

const noel = {
  id: 1,
  lastname: "Ertsemud",
  firstname: "Noel",
};

const escapeGameSigna: SignaSection = {
  location: "Creux CGU",
  signages: [],
};

describe("General section of festival activity preparation", () => {
  let prepareFestivalActivity: PrepareFestivalActivity;
  let festivalActivityFactory: CreateFestivalActivity;
  let festivalActivityRepository: InMemoryFestivalActivityRepository;
  let escapeGameActivity: DraftFestivalActivity;

  beforeEach(() => {
    festivalActivityFactory = new CreateFestivalActivity();
    const escapeGameCreation = festivalActivityFactory.create({
      name: "Escape Game",
      author: noel,
    });
    escapeGameActivity = DraftFestivalActivity.build({
      ...escapeGameCreation,
      signa: escapeGameSigna,
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
    describe("when adherent want to update location", () => {
      it("should only update location", async () => {
        const updateLocation = { location: "Derrière TC" };

        const { signa } = await prepareFestivalActivity.updateSignaSection(
          escapeGameActivity.id,
          updateLocation,
        );

        expect(signa.location).toBe(updateLocation.location);
        expect(signa.signages).toEqual(escapeGameSigna.signages);
      });
    });
  });
});
