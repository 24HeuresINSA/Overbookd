import {
  DRAFT,
  IN_REVIEW,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event-constants";
import { describe, expect, it } from "vitest";
import { APPROVED, REJECTED } from "../common/action";
import { NOT_ASKING_TO_REVIEW, REVIEWING } from "../common/review";
import {
  InReviewPreview,
  PreviewDraft,
  PreviewReviewable,
  RefusedPreview,
  ValidatedPreview,
} from "./festival-activity";
import { getFactory } from "./festival-activity.factory";
import { lea, noel } from "./festival-activity.fake";
import { previewOf } from "./preview-of";

const festivalActivityFactory = getFactory();

type TestHelper<Preview extends PreviewReviewable> = {
  name: Preview["name"];
  adherent: Preview["adherent"];
  team: Preview["team"];
  reviews: Preview["reviews"];
};

describe("Transform a festival activity to its preview", () => {
  describe.each([
    { name: "VGC Tournament", adherent: lea, team: null },
    { name: "Escape game", adherent: noel, team: "plaizirs" },
  ])("when the festival activity is in draft", ({ name, adherent, team }) => {
    it("should return a draft preview", () => {
      const draft = festivalActivityFactory
        .draft(name)
        .withInCharge({ adherent, team })
        .build();
      const expected: PreviewDraft = {
        id: draft.id,
        name,
        status: DRAFT,
        adherent,
        team,
      };
      expect(previewOf(draft)).toStrictEqual(expected);
    });
  });
  describe.each<TestHelper<InReviewPreview>>([
    {
      name: "VGC Tournament",
      adherent: lea,
      team: "culture",
      reviews: {
        humain: REVIEWING,
        communication: REVIEWING,
        matos: REVIEWING,
        barrieres: REVIEWING,
        elec: REVIEWING,
        signa: REVIEWING,
        secu: REVIEWING,
      },
    },
    {
      name: "Escape game",
      adherent: noel,
      team: "plaizirs",
      reviews: {
        humain: REVIEWING,
        communication: NOT_ASKING_TO_REVIEW,
        matos: REVIEWING,
        barrieres: APPROVED,
        elec: REVIEWING,
        signa: APPROVED,
        secu: REVIEWING,
      },
    },
  ])(
    "when the festival activity is in review",
    ({ name, adherent, team, reviews }) => {
      it("should return a review preview", () => {
        const inReview = festivalActivityFactory
          .inReview(name)
          .withInCharge({ adherent, team })
          .withReviews(reviews)
          .build();

        const expected: InReviewPreview = {
          id: inReview.id,
          name,
          status: IN_REVIEW,
          adherent,
          team,
          reviews,
        };
        expect(previewOf(inReview)).toStrictEqual(expected);
      });
    },
  );
  describe.each<TestHelper<ValidatedPreview>>([
    {
      name: "VGC Tournament",
      adherent: lea,
      team: "culture",
      reviews: {
        humain: APPROVED,
        communication: APPROVED,
        matos: APPROVED,
        barrieres: APPROVED,
        elec: APPROVED,
        signa: APPROVED,
        secu: APPROVED,
      },
    },
    {
      name: "Escape game",
      adherent: noel,
      team: "plaizirs",
      reviews: {
        humain: APPROVED,
        communication: NOT_ASKING_TO_REVIEW,
        matos: APPROVED,
        barrieres: APPROVED,
        elec: APPROVED,
        signa: APPROVED,
        secu: APPROVED,
      },
    },
  ])(
    "when the festival activity is validated",
    ({ name, adherent, team, reviews }) => {
      it("should return a validated preview", () => {
        const validated = festivalActivityFactory
          .validated(name)
          .withInCharge({ adherent, team })
          .withReviews(reviews)
          .build();

        const expected: ValidatedPreview = {
          id: validated.id,
          name,
          status: VALIDATED,
          adherent,
          team,
          reviews,
        };
        expect(previewOf(validated)).toStrictEqual(expected);
      });
    },
  );
  describe.each<TestHelper<RefusedPreview>>([
    {
      name: "VGC Tournament",
      adherent: lea,
      team: "culture",
      reviews: {
        humain: APPROVED,
        communication: APPROVED,
        matos: REJECTED,
        barrieres: REJECTED,
        elec: REVIEWING,
        signa: REJECTED,
        secu: REVIEWING,
      },
    },
    {
      name: "Escape game",
      adherent: noel,
      team: "plaizirs",
      reviews: {
        humain: REVIEWING,
        communication: NOT_ASKING_TO_REVIEW,
        matos: REVIEWING,
        barrieres: APPROVED,
        elec: REJECTED,
        signa: APPROVED,
        secu: REJECTED,
      },
    },
  ])(
    "when the festival activity is refused",
    ({ name, adherent, team, reviews }) => {
      it("should return a refused preview", () => {
        const refused = festivalActivityFactory
          .refused(name)
          .withInCharge({ adherent, team })
          .withReviews(reviews)
          .build();

        const expected: RefusedPreview = {
          id: refused.id,
          name,
          status: REFUSED,
          adherent,
          team,
          reviews,
        };
        expect(previewOf(refused)).toStrictEqual(expected);
      });
    },
  );
});
