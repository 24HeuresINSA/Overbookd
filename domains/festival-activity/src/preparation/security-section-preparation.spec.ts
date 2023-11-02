import { beforeEach, describe, expect, it } from "vitest";
import { DraftFestivalActivity } from "./draft-festival-activity";
import { CreateFestivalActivity } from "../creation/creation";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryFestivalActivityRepository } from "../festival-activity-repository.inmemory";
import { SecuritySection } from "../festival-activity";

const noel = {
  id: 1,
  lastname: "Ertsemud",
  firstname: "Noel",
};

const escapeGameSecurity: SecuritySection = {
  specialNeed: "Pas de besoin particulier",
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
      security: escapeGameSecurity,
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
    describe("when adherent want to update special need", () => {
      it("should update special need", async () => {
        const updateSecurity = { specialNeed: "Un vigil à l'entrée" };

        const { security } =
          await prepareFestivalActivity.updateSecuritySection(
            escapeGameActivity.id,
            updateSecurity,
          );

        expect(security.specialNeed).toBe(updateSecurity.specialNeed);
      });
    });
  });
});
