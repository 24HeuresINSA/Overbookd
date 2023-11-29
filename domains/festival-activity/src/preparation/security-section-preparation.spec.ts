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
      activityName               | activityId       | update                                                | expectedSpecialNeed
      ${escapeGame.general.name} | ${escapeGame.id} | ${{ specialNeed: "Une bombe pour plus de réalisme" }} | ${"Une bombe pour plus de réalisme"}
      ${pcSecurite.general.name} | ${pcSecurite.id} | ${{ specialNeed: null }}                              | ${null}
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

  describe(`when ${validatedBySecu.general.name} is already validated by ${secu} team`, () => {
    describe("when trying to update the security information", () => {
      it("should indicate that security section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.updateSecuritySection(
              validatedBySecu.id,
              { specialNeed: "3 maîtres chien" },
            ),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
  });
});
