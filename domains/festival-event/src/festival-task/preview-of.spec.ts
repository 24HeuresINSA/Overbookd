import {
  DRAFT,
  IN_REVIEW,
  READY_TO_ASSIGN,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event-constants";
import { describe, expect, it } from "vitest";
import { APPROVED, REJECTED } from "../common/action";
import { NOT_ASKING_TO_REVIEW, REVIEWING } from "../common/review";
import {
  PreviewInReview,
  PreviewDraft,
  PreviewReviewable,
  PreviewRefused,
  PreviewValidated,
  PreviewReadyToAssign,
} from "./festival-task";
import { getFactory } from "./festival-task.factory";
import { previewOf } from "./preview-of";
import { lea, noel } from "./festival-task.test-util";

const festivalTaskFactory = getFactory();

type TestHelper<Preview extends PreviewReviewable> = {
  name: Preview["name"];
  administrator: Preview["administrator"];
  team: Preview["team"];
  reviewer: Preview["reviewer"];
  reviews: Preview["reviews"];
};

describe("Transform a festival task to its preview", () => {
  describe.each([
    {
      name: "Watch VGC Tournament",
      administrator: lea,
      reviewer: noel,
      team: null,
    },
    {
      name: "Install Escape game",
      administrator: noel,
      reviewer: lea,
      team: "plaizirs",
    },
  ])("when the festival task is in draft", ({ name, administrator, team }) => {
    it("should return a draft preview", () => {
      const draft = festivalTaskFactory
        .draft(name)
        .withGeneral({ administrator, team })
        .build();
      const expected: PreviewDraft = {
        id: draft.id,
        name,
        status: DRAFT,
        administrator,
        team,
      };
      expect(previewOf(draft)).toStrictEqual(expected);
    });
  });

  describe.each<TestHelper<PreviewInReview>>([
    {
      name: "Watch VGC Tournament",
      administrator: lea,
      team: "culture",
      reviewer: noel,
      reviews: {
        humain: REVIEWING,
        matos: REVIEWING,
        elec: REVIEWING,
      },
    },
    {
      name: "Install Escape game",
      administrator: noel,
      team: "plaizirs",
      reviewer: lea,
      reviews: {
        humain: REVIEWING,
        matos: REVIEWING,
        elec: NOT_ASKING_TO_REVIEW,
      },
    },
  ])(
    "when the festival task is in review",
    ({ name, administrator, team, reviews, reviewer }) => {
      it("should return a review preview", () => {
        const inReview = festivalTaskFactory
          .inReview(name)
          .withGeneral({ administrator, team })
          .withReviews(reviews)
          .withReviewer(reviewer)
          .build();

        const expected: PreviewInReview = {
          id: inReview.id,
          name,
          status: IN_REVIEW,
          administrator,
          team,
          reviewer,
          reviews,
        };
        expect(previewOf(inReview)).toStrictEqual(expected);
      });
    },
  );

  describe.each<TestHelper<PreviewValidated>>([
    {
      name: "Watch VGC Tournament",
      administrator: lea,
      team: "culture",
      reviewer: noel,
      reviews: {
        humain: APPROVED,
        matos: APPROVED,
        elec: APPROVED,
      },
    },
    {
      name: "Install Escape game",
      administrator: noel,
      team: "plaizirs",
      reviewer: lea,
      reviews: {
        humain: APPROVED,
        matos: APPROVED,
        elec: APPROVED,
      },
    },
  ])(
    "when the festival task is validated",
    ({ name, administrator, team, reviews, reviewer }) => {
      it("should return a validated preview", () => {
        const validated = festivalTaskFactory
          .validated(name)
          .withGeneral({ administrator, team })
          .withReviews(reviews)
          .withReviewer(reviewer)
          .build();

        const expected: PreviewValidated = {
          id: validated.id,
          name,
          status: VALIDATED,
          administrator,
          team,
          reviewer,
          reviews,
        };
        expect(previewOf(validated)).toStrictEqual(expected);
      });
    },
  );

  describe.each<TestHelper<PreviewRefused>>([
    {
      name: "Watch VGC Tournament",
      administrator: lea,
      team: "culture",
      reviewer: noel,
      reviews: {
        humain: APPROVED,
        matos: REJECTED,
        elec: REVIEWING,
      },
    },
    {
      name: "Install Escape game",
      administrator: noel,
      team: "plaizirs",
      reviewer: lea,
      reviews: {
        humain: REVIEWING,
        matos: REVIEWING,
        elec: REJECTED,
      },
    },
  ])(
    "when the festival task is refused",
    ({ name, administrator, team, reviews, reviewer }) => {
      it("should return a refused preview", () => {
        const refused = festivalTaskFactory
          .refused(name)
          .withGeneral({ administrator, team })
          .withReviews(reviews)
          .withReviewer(reviewer)
          .build();

        const expected: PreviewRefused = {
          id: refused.id,
          name,
          status: REFUSED,
          administrator,
          team,
          reviewer,
          reviews,
        };
        expect(previewOf(refused)).toStrictEqual(expected);
      });
    },
  );

  describe.each<TestHelper<PreviewReadyToAssign>>([
    {
      name: "Watch VGC Tournament",
      administrator: lea,
      team: "culture",
      reviewer: noel,
      reviews: {
        humain: APPROVED,
        matos: APPROVED,
        elec: APPROVED,
      },
    },
    {
      name: "Install Escape game",
      administrator: noel,
      team: "plaizirs",
      reviewer: lea,
      reviews: {
        humain: APPROVED,
        matos: APPROVED,
        elec: APPROVED,
      },
    },
  ])(
    "when the festival task is ready to assign",
    ({ name, administrator, team, reviews, reviewer }) => {
      it("should return a ready to assign preview", () => {
        const ready = festivalTaskFactory
          .readyToAssign(name)
          .withGeneral({ administrator, team })
          .withReviews(reviews)
          .withReviewer(reviewer)
          .build();

        const expected: PreviewReadyToAssign = {
          id: ready.id,
          name,
          status: READY_TO_ASSIGN,
          administrator,
          team,
          reviewer,
          reviews,
        };
        expect(previewOf(ready)).toStrictEqual(expected);
      });
    },
  );
});
