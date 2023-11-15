import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import { escapeGame, pcSecurite } from "./preparation.test-utils";

describe("Security section of festival activity preparation", () => {
  let prepareFestivalActivity: PrepareFestivalActivity;
  let prepareFestivalActivities: InMemoryPrepareFestivalActivityRepository;

  beforeEach(() => {
    prepareFestivalActivities = new InMemoryPrepareFestivalActivityRepository([
      escapeGame,
      pcSecurite,
    ]);
    prepareFestivalActivity = new PrepareFestivalActivity(
      prepareFestivalActivities,
    );
  });

  describe("when adherent want to update a field", () => {
    describe.each`
      activityName               | activityId       | update                                                | expectedSpecialNeed
      ${escapeGame.general.name} | ${escapeGame.id} | ${{ specialNeed: "Une bombe pour plus de réalisme" }} | ${"Une bombe pour plus de réalisme"}
      ${pcSecurite.general.name} | ${pcSecurite.id} | ${{ specialNeed: null }}                              | ${null}
      ${pcSecurite.general.name} | ${pcSecurite.id} | ${{}}                                                 | ${"Un vigil à l'entrée"}
    `(
      "when updating special need from $activityName",
      ({ activityId, update, expectedSpecialNeed }) => {
        it("should only update security need", async () => {
          const { security } =
            await prepareFestivalActivity.updateSecuritySection(
              activityId,
              update,
            );

          expect(security.specialNeed).toEqual(expectedSpecialNeed);
        });
      },
    );
  });
});
