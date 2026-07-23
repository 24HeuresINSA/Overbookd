import { beforeEach, describe, expect, it } from "vitest";
import {
  DRAFT,
  IN_REVIEW,
  NOT_ASKING_TO_REVIEW,
  READY_TO_REVIEW,
  REVIEWING,
} from "@overbookd/festival-event-constants";
import { Reviewer } from "../../common/review.js";
import { CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE } from "../../common/ready-for-review.error.js";
import { AskForReview, isReviewer } from "./ask-for-review.js";
import {
  pcSecurite,
  finaleEsport,
  internalWithoutDescription,
  publicWithoutPhoto,
  publicWithoutCategory,
  publicWithoutTimeWindows,
  internalWithoutTeamInCharge,
  internalWithoutLocation,
  internalWithoutInquiries,
  internalWithoutInquiryTimeWindows,
  justCreated,
  escapeGame,
  bubbleFoot,
} from "./ask-for-review.test-utils.js";
import { InReviewFestivalActivity } from "./in-review-festival-activity.js";
import { InMemoryAskForReviewFestivalActivityRepository } from "./festival-activities.inmemory.js";
import { george, lea } from "../festival-activity.fake.js";
import { CantAskForReview } from "../../common/review.error.js";
import {
  BARRIERES,
  COMMUNICATION,
  HUMAIN,
  LOG_ELEC,
  LOG_MATOS,
  SECU,
  SIGNA,
} from "@overbookd/team-constants";

describe("Festival Activity - ask for review", () => {
  let askForReview: AskForReview;
  beforeEach(() => {
    const festivalActivities =
      new InMemoryAskForReviewFestivalActivityRepository([
        pcSecurite,
        finaleEsport,
        internalWithoutDescription,
        publicWithoutPhoto,
        publicWithoutCategory,
        publicWithoutTimeWindows,
        internalWithoutTeamInCharge,
        internalWithoutLocation,
        internalWithoutInquiries,
        internalWithoutInquiryTimeWindows,
        justCreated,
        escapeGame,
        bubbleFoot,
      ]);
    askForReview = new AskForReview(festivalActivities);
  });
  describe("when asking a review for a draft festival activity", () => {
    describe("when draft festival activity has all required fields fulfilled", () => {
      it("should indicate it is reviewable", async () => {
        const inReviewFa = await askForReview.from(pcSecurite.id, lea);
        expect(inReviewFa.status).toBe(IN_REVIEW);
      });
      it("should add READY_TO_REVIEW key event to history", async () => {
        const inReviewFa = await askForReview.from(pcSecurite.id, lea);

        expect(inReviewFa.history).toStrictEqual([
          ...pcSecurite.history,
          {
            action: READY_TO_REVIEW,
            by: lea,
            at: expect.any(Date),
            description: "Demande de relecture de la FA",
          },
        ]);
      });
      it("should keep draft festival activity sections", async () => {
        const inReviewFa = await askForReview.from(pcSecurite.id, lea);

        expect(inReviewFa.inCharge).toEqual(pcSecurite.inCharge);
        expect(inReviewFa.id).toBe(pcSecurite.id);
        expect(inReviewFa.general).toEqual(pcSecurite.general);
        expect(inReviewFa.inquiry).toEqual(pcSecurite.inquiry);
        expect(inReviewFa.security).toEqual(pcSecurite.security);
        expect(inReviewFa.signa).toEqual(pcSecurite.signa);
        expect(inReviewFa.supply).toEqual(pcSecurite.supply);
      });
      describe("reviews", () => {
        it.each`
          team             | status
          ${COMMUNICATION} | ${NOT_ASKING_TO_REVIEW}
          ${HUMAIN}        | ${REVIEWING}
          ${SIGNA}         | ${REVIEWING}
          ${SECU}          | ${REVIEWING}
          ${LOG_MATOS}     | ${REVIEWING}
          ${LOG_ELEC}      | ${REVIEWING}
          ${BARRIERES}     | ${REVIEWING}
        `("should explain $team is $status", async ({ team, status }) => {
          const inReviewFa = await askForReview.from(pcSecurite.id, lea);
          if (!isReviewer(team)) throw new Error();
          // eslint-disable-next-line security/detect-object-injection
          expect(inReviewFa.reviews[team]).toBe(status);
        });
        describe("when it will be published (i.e. is public)", () => {
          it.each`
            team             | status
            ${COMMUNICATION} | ${REVIEWING}
            ${HUMAIN}        | ${REVIEWING}
            ${SIGNA}         | ${REVIEWING}
            ${SECU}          | ${REVIEWING}
            ${LOG_MATOS}     | ${REVIEWING}
            ${LOG_ELEC}      | ${REVIEWING}
            ${BARRIERES}     | ${REVIEWING}
          `(
            "should explain $team is concern with review",
            async ({ team, status }) => {
              const inReviewFa = await askForReview.from(
                finaleEsport.id,
                george,
              );
              if (!isReviewer(team)) throw new Error();
              // eslint-disable-next-line security/detect-object-injection
              expect(inReviewFa.reviews[team]).toBe(status);
            },
          );
        });
      });
    });
    describe("when not providing a description", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () =>
            await askForReview.from(internalWithoutDescription.id, lea),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate description is required", async () => {
        expect(
          async () =>
            await askForReview.from(internalWithoutDescription.id, lea),
        ).rejects.toThrow("- Une description est nécessaire");
      });
    });
    describe("when not providing a photolink on a public activity", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () => await askForReview.from(publicWithoutPhoto.id, lea),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate photoLink is required on public activity", async () => {
        expect(
          async () => await askForReview.from(publicWithoutPhoto.id, lea),
        ).rejects.toThrow(
          "- Une photo est nécessaire pour les animations publiées",
        );
      });
    });
    describe("when not providing any category on a public activity", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () => await askForReview.from(publicWithoutCategory.id, lea),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate categories require at least one element on public activity", async () => {
        expect(
          async () => await askForReview.from(publicWithoutCategory.id, lea),
        ).rejects.toThrow(
          "- Au moins une catégorie est nécessaire pour les animations publiées",
        );
      });
    });
    describe("when not providing any timewindows on a public activity", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () => await askForReview.from(publicWithoutTimeWindows.id, lea),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate timeWindows require at least one element on public activity", async () => {
        expect(
          async () => await askForReview.from(publicWithoutTimeWindows.id, lea),
        ).rejects.toThrow(
          "- Au moins un créneau horaire est nécessaire pour les animations publiées",
        );
      });
    });
    describe("when not providing team in charge", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () =>
            await askForReview.from(internalWithoutTeamInCharge.id, lea),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate team in charge is required", async () => {
        expect(
          async () =>
            await askForReview.from(internalWithoutTeamInCharge.id, lea),
        ).rejects.toThrow("- Une équipe responsable est nécessaire");
      });
    });
    describe("when not providing a location", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () => await askForReview.from(internalWithoutLocation.id, lea),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate location is required", async () => {
        expect(
          async () => await askForReview.from(internalWithoutLocation.id, lea),
        ).rejects.toThrow("- Le lieu est nécessaire");
      });
    });
    describe("when there is at least one timeWindows but not any inquiries provided", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () => await askForReview.from(internalWithoutInquiries.id, lea),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate at least one inquiry is required", async () => {
        expect(
          async () => await askForReview.from(internalWithoutInquiries.id, lea),
        ).rejects.toThrow(
          "- Au moins une demande de matos est nécessaire pour un créneau matos",
        );
      });
    });
    describe("when there is at least one inquiry from gear, barriers or electricity but not any timeWindows provided", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () =>
            await askForReview.from(internalWithoutInquiryTimeWindows.id, lea),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate timeWindows is required", async () => {
        expect(
          async () =>
            await askForReview.from(internalWithoutInquiryTimeWindows.id, lea),
        ).rejects.toThrow(
          "- Au moins un créneau matos est nécessaire pour une demande matos",
        );
      });
    });
    describe("when there is more than one error", () => {
      it("should indicate all", () => {
        expect(
          async () => await askForReview.from(justCreated.id, lea),
        ).rejects.toThrow("- Le lieu est nécessaire");
        expect(
          async () => await askForReview.from(justCreated.id, lea),
        ).rejects.toThrow("- Une description est nécessaire");
        expect(
          async () => await askForReview.from(justCreated.id, lea),
        ).rejects.toThrow("- Une équipe responsable est nécessaire");
      });
    });
    describe("when ask several time for a review", () => {
      beforeEach(() => {
        const festivalActivities =
          new InMemoryAskForReviewFestivalActivityRepository([
            InReviewFestivalActivity.init(
              { ...pcSecurite, status: DRAFT },
              lea,
            ),
          ]);
        askForReview = new AskForReview(festivalActivities);
      });
      it("should indicate that festival activity is already under review", async () => {
        expect(
          async () => await askForReview.from(pcSecurite.id, lea),
        ).rejects.toThrow(CantAskForReview);
      });
    });
  });
  describe("when asking a review for a refused festival activity", () => {
    describe.each`
      activityName               | activity      | rejectors
      ${escapeGame.general.name} | ${escapeGame} | ${[COMMUNICATION, SECU, HUMAIN]}
      ${bubbleFoot.general.name} | ${bubbleFoot} | ${[BARRIERES, LOG_ELEC]}
    `(
      "when $activityName was rejected by $rejectors",
      ({ activity, rejectors }) => {
        it("should indicate it is reviewable", async () => {
          const author = activity.inCharge.adherent;
          const inReview = await askForReview.from(activity.id, author);
          expect(inReview.status).toBe(IN_REVIEW);
        });
        it("should add READY_TO_REVIEW key event to history", async () => {
          const author = activity.inCharge.adherent;
          const inReview = await askForReview.from(activity.id, author);

          expect(inReview.history).toStrictEqual([
            ...activity.history,
            {
              action: READY_TO_REVIEW,
              by: author,
              at: expect.any(Date),
              description: "Demande de relecture de la FA",
            },
          ]);
        });
      },
    );
    describe("when asking several time a review for same refused festival activity", () => {
      it("should indicate festival activity is already in review", async () => {
        await askForReview.from(escapeGame.id, lea);
        expect(
          async () => await askForReview.from(escapeGame.id, lea),
        ).rejects.toThrow(CantAskForReview);
      });
    });
  });
});
