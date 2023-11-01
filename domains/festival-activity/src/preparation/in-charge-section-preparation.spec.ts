import { beforeEach, describe, expect, it } from "vitest";
import { DraftFestivalActivity } from "../draft-festival-activity";
import { FestivalActivityCreation } from "../creation/creation";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryFestivalActivityRepository } from "../festival-activity-repository.inmemory";
import { InChargeSection } from "../festival-activity.core";

const noel = {
  id: 1,
  lastname: "Ertsemud",
  firstname: "Noel",
};

const lea = {
  id: 2,
  lastname: "Mouyno",
  firstname: "Lea",
};

const escapeGameInCharge: InChargeSection = {
  adherent: noel,
  team: "culture",
  contractors: [],
};

describe("General section of festival activity preparation", () => {
  let prepareFestivalActivity: PrepareFestivalActivity;
  let festivalActivityFactory: FestivalActivityCreation;
  let festivalActivityRepository: InMemoryFestivalActivityRepository;
  let escapeGameActivity: DraftFestivalActivity;

  beforeEach(() => {
    festivalActivityFactory = new FestivalActivityCreation();
    const escapeGameCreation = festivalActivityFactory.create({
      name: "Escape Game",
      author: noel,
    });
    escapeGameActivity = DraftFestivalActivity.build({
      ...escapeGameCreation,
      inCharge: escapeGameInCharge,
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
    describe("when adherent want to update adherent in charge", () => {
      it("should only update adherent", async () => {
        const updateAdherent = { adherent: lea };

        const { inCharge } =
          await prepareFestivalActivity.updateInChargeSection(
            escapeGameActivity.id,
            updateAdherent,
          );

        expect(inCharge.adherent).toBe(updateAdherent.adherent);

        const { team, contractors } = escapeGameInCharge;

        expect(inCharge.team).toBe(team);
        expect(inCharge.contractors).toEqual(contractors);
      });
    });

    describe("when adherent want to update team in charge", () => {
      it("should only update team", async () => {
        const updateTeam = { team: "plaizir" };

        const { inCharge } =
          await prepareFestivalActivity.updateInChargeSection(
            escapeGameActivity.id,
            updateTeam,
          );

        expect(inCharge.team).toBe(updateTeam.team);

        const { adherent, contractors } = escapeGameInCharge;

        expect(inCharge.adherent).toBe(adherent);
        expect(inCharge.contractors).toEqual(contractors);
      });
    });
  });

  describe("when adherent want to update multiple fields consecutively", () => {
    describe("when adherent want to update adherent then team in 2 times", () => {
      it("should update both adherent and team", async () => {
        const updateAdherent = { adherent: lea };
        const updateTeam = { team: "plaizir" };

        await prepareFestivalActivity.updateInChargeSection(
          escapeGameActivity.id,
          updateAdherent,
        );

        const { inCharge } =
          await prepareFestivalActivity.updateInChargeSection(
            escapeGameActivity.id,
            updateTeam,
          );

        expect(inCharge.adherent).toBe(updateAdherent.adherent);
        expect(inCharge.team).toBe(updateTeam.team);
      });
    });
  });
});
