import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import {
  escapeGame,
  pcSecurite,
  validatedBySecu,
} from "./preparation.test-utils";
import { secu } from "../sections/reviews";
import { PrepareError } from "./prepare-in-review-festival-activity";
import { FreePassMustBePositive } from "../festival-activity.error";

describe("Security section of festival activity preparation", () => {
  let prepareFestivalActivity: PrepareFestivalActivity;
  let prepareFestivalActivities: InMemoryPrepareFestivalActivityRepository;

  beforeEach(() => {
    prepareFestivalActivities = new InMemoryPrepareFestivalActivityRepository([
      escapeGame,
      pcSecurite,
      validatedBySecu,
    ]);
    prepareFestivalActivity = new PrepareFestivalActivity(
      prepareFestivalActivities,
    );
  });

  describe("when adherent want to update a field", () => {
    describe.each`
      fields                          | activityName               | activityId       | update                                                             | specialNeed                          | freePass
      ${"special need"}               | ${escapeGame.general.name} | ${escapeGame.id} | ${{ specialNeed: "Une bombe pour plus de réalisme" }}              | ${"Une bombe pour plus de réalisme"} | ${escapeGame.security.freePass}
      ${"special need"}               | ${pcSecurite.general.name} | ${pcSecurite.id} | ${{ specialNeed: null }}                                           | ${null}                              | ${pcSecurite.security.freePass}
      ${"free pass"}                  | ${escapeGame.general.name} | ${escapeGame.id} | ${{ freePass: 2 }}                                                 | ${escapeGame.security.specialNeed}   | ${2}
      ${"free pass"}                  | ${pcSecurite.general.name} | ${pcSecurite.id} | ${{ freePass: 0 }}                                                 | ${pcSecurite.security.specialNeed}   | ${0}
      ${"special need and free pass"} | ${escapeGame.general.name} | ${escapeGame.id} | ${{ specialNeed: "Une bombe pour plus de réalisme", freePass: 2 }} | ${"Une bombe pour plus de réalisme"} | ${2}
    `(
      "when updating special need from $activityName",
      ({ fields, activityId, update, specialNeed, freePass }) => {
        it(`should only update ${fields}`, async () => {
          const { security } =
            await prepareFestivalActivity.updateSecuritySection(
              activityId,
              update,
            );

          expect(security.specialNeed).toEqual(specialNeed);
          expect(security.freePass).toEqual(freePass);
        });
      },
    );
  });

  describe("when adherent want to update free pass with negative value", () => {
    it("should indicate that free pass must be positive", async () => {
      const update = { freePass: -1 };
      expect(
        async () =>
          await prepareFestivalActivity.updateSecuritySection(
            escapeGame.id,
            update,
          ),
      ).rejects.toThrow(FreePassMustBePositive);
    });
  });

  describe(`when ${validatedBySecu.general.name} is already validated by ${secu} team`, () => {
    describe("when trying to update the security information", () => {
      it("should indicate that security section is locked", async () => {
        const update = { specialNeed: "3 maîtres chien", freePass: 3 };
        expect(
          async () =>
            await prepareFestivalActivity.updateSecuritySection(
              validatedBySecu.id,
              update,
            ),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
  });
});
