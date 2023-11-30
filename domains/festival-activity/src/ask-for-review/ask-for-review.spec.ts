import { beforeEach, describe, expect, it } from "vitest";
import {
  barrieres,
  comcom,
  elec,
  humain,
  matos,
  secu,
  signa,
} from "../sections/reviews";
import { CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE } from "./ready-for-review.error";
import { DRAFT, IN_REVIEW } from "../festival-activity";
import { REVIEWING, NOT_ASKING_TO_REVIEW } from "../sections/reviews";
import { AskForReview } from "./ask-for-review";
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
} from "./ask-for-review.test-utils";
import { InReviewFestivalActivity } from "./in-review-festival-activity";
import { Review } from "../festival-activity.error";
import { InMemoryNotifications } from "./notifications.inmemory";
import { InMemoryAskForReviewFestivalActivityRepository } from "./festival-activities.inmemory";
import { isReviewer } from "./ask-for-review";

describe("Ask for review", () => {
  let askForReview: AskForReview;
  let notifications: InMemoryNotifications;
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
      ]);
    notifications = new InMemoryNotifications();
    askForReview = new AskForReview(festivalActivities, notifications);
  });
  describe("when asking a review for a draft festival activity", () => {
    describe("when draft festival activity has all required fields fulfilled", () => {
      it("should indicate festival activity is reviewable", async () => {
        const inReviewFa = await askForReview.fromDraft(pcSecurite.id);
        expect(inReviewFa.status).toBe(IN_REVIEW);
      });
      it("should keep draft festival activity sections", async () => {
        const inReviewFa = await askForReview.fromDraft(pcSecurite.id);

        expect(inReviewFa.inCharge).toEqual(pcSecurite.inCharge);
        expect(inReviewFa.id).toBe(pcSecurite.id);
        expect(inReviewFa.general).toEqual(pcSecurite.general);
        expect(inReviewFa.inquiry).toEqual(pcSecurite.inquiry);
        expect(inReviewFa.security).toEqual(pcSecurite.security);
        expect(inReviewFa.signa).toEqual(pcSecurite.signa);
        expect(inReviewFa.supply).toEqual(pcSecurite.supply);
      });
      describe("reviews", () => {
        it("should ask review from humain, signa, secu, matos, elec and barrieres,", async () => {
          const inReviewFa = await askForReview.fromDraft(pcSecurite.id);

          const event = { id: inReviewFa.id, name: inReviewFa.general.name };
          const barrieresNotification = { team: barrieres, event };

          expect(notifications.entries).toHaveLength(6);
          expect(notifications.entries).toContainEqual({ team: humain, event });
          expect(notifications.entries).toContainEqual({ team: signa, event });
          expect(notifications.entries).toContainEqual({ team: secu, event });
          expect(notifications.entries).toContainEqual({ team: matos, event });
          expect(notifications.entries).toContainEqual({ team: elec, event });
          expect(notifications.entries).toContainEqual(barrieresNotification);
        });
        it.each`
          team         | status
          ${comcom}    | ${NOT_ASKING_TO_REVIEW}
          ${humain}    | ${REVIEWING}
          ${signa}     | ${REVIEWING}
          ${secu}      | ${REVIEWING}
          ${matos}     | ${REVIEWING}
          ${elec}      | ${REVIEWING}
          ${barrieres} | ${REVIEWING}
        `("should explain $team is $status", async ({ team, status }) => {
          const inReviewFa = await askForReview.fromDraft(pcSecurite.id);
          if (!isReviewer(team)) throw new Error();
          // eslint-disable-next-line security/detect-object-injection
          expect(inReviewFa.reviews[team]).toBe(status);
        });
        describe("when festival activity will be published (i.e. is public)", () => {
          it("should also ask review from comcom", async () => {
            const inReviewFa = await askForReview.fromDraft(finaleEsport.id);

            const event = { id: inReviewFa.id, name: inReviewFa.general.name };
            const comcomNotification = { team: comcom, event };
            const humainNotification = { team: humain, event };
            const signaNotification = { team: signa, event };
            const secuNotification = { team: secu, event };
            const matosNotification = { team: matos, event };
            const elecNotification = { team: elec, event };
            const barrieresNotification = { team: barrieres, event };

            expect(notifications.entries).toHaveLength(7);
            expect(notifications.entries).toContainEqual(comcomNotification);
            expect(notifications.entries).toContainEqual(humainNotification);
            expect(notifications.entries).toContainEqual(signaNotification);
            expect(notifications.entries).toContainEqual(secuNotification);
            expect(notifications.entries).toContainEqual(matosNotification);
            expect(notifications.entries).toContainEqual(elecNotification);
            expect(notifications.entries).toContainEqual(barrieresNotification);
          });
          it.each`
            team         | status
            ${comcom}    | ${REVIEWING}
            ${humain}    | ${REVIEWING}
            ${signa}     | ${REVIEWING}
            ${secu}      | ${REVIEWING}
            ${matos}     | ${REVIEWING}
            ${elec}      | ${REVIEWING}
            ${barrieres} | ${REVIEWING}
          `(
            "should explain $team is concern with review",
            async ({ team, status }) => {
              const inReviewFa = await askForReview.fromDraft(finaleEsport.id);
              if (!isReviewer(team)) throw new Error();
              // eslint-disable-next-line security/detect-object-injection
              expect(inReviewFa.reviews[team]).toBe(status);
            },
          );
        });
      });

      describe("when festival activity will be published (i.e. is public)", () => {
        it("should also ask review from comcom", async () => {
          const inReviewFa = await askForReview.fromDraft(finaleEsport.id);
          expect(notifications.entries).toHaveLength(7);
          const event = { id: inReviewFa.id, name: inReviewFa.general.name };
          expect(notifications.entries).toContainEqual({ team: comcom, event });
          expect(notifications.entries).toContainEqual({ team: humain, event });
          expect(notifications.entries).toContainEqual({ team: signa, event });
          expect(notifications.entries).toContainEqual({ team: secu, event });
          expect(notifications.entries).toContainEqual({ team: matos, event });
          expect(notifications.entries).toContainEqual({ team: elec, event });
          expect(notifications.entries).toContainEqual({
            team: barrieres,
            event,
          });
        });
      });
    });
    describe("when not providing a description", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(internalWithoutDescription.id),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate description is required", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(internalWithoutDescription.id),
        ).rejects.toThrow("- Une description est nécessaire");
      });
    });
    describe("when not providing a photolink on a public activity", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () => await askForReview.fromDraft(publicWithoutPhoto.id),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate photoLink is required on public activity", async () => {
        expect(
          async () => await askForReview.fromDraft(publicWithoutPhoto.id),
        ).rejects.toThrow(
          "- Une photo est nécessaire pour les animations publiées",
        );
      });
    });
    describe("when not providing any category on a public activity", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () => await askForReview.fromDraft(publicWithoutCategory.id),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate categories require at least one element on public activity", async () => {
        expect(
          async () => await askForReview.fromDraft(publicWithoutCategory.id),
        ).rejects.toThrow(
          "- Au moins une catégorie est nécessaire pour les animations publiées",
        );
      });
    });
    describe("when not providing any timewindows on a public activity", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () => await askForReview.fromDraft(publicWithoutTimeWindows.id),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate timeWindows require at least one element on public activity", async () => {
        expect(
          async () => await askForReview.fromDraft(publicWithoutTimeWindows.id),
        ).rejects.toThrow(
          "- Au moins un créneau horaire est nécessaire pour les animations publiées",
        );
      });
    });
    describe("when not providing team in charge", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(internalWithoutTeamInCharge.id),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate team in charge is required", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(internalWithoutTeamInCharge.id),
        ).rejects.toThrow("- Une équipe responsable est nécessaire");
      });
    });
    describe("when not providing a location", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () => await askForReview.fromDraft(internalWithoutLocation.id),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate location is required", async () => {
        expect(
          async () => await askForReview.fromDraft(internalWithoutLocation.id),
        ).rejects.toThrow("- Le lieu est nécessaire");
      });
    });
    describe("when there is at least one timeWindows but not any inquiries provided", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () => await askForReview.fromDraft(internalWithoutInquiries.id),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate at least one inquiry is required", async () => {
        expect(
          async () => await askForReview.fromDraft(internalWithoutInquiries.id),
        ).rejects.toThrow(
          "- Au moins une demande de matos est nécessaire pour un créneau matos",
        );
      });
    });
    describe("when there is at least one inquiry from gear, barriers or electricity but not any timeWindows provided", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(internalWithoutInquiryTimeWindows.id),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate timeWindows is required", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(internalWithoutInquiryTimeWindows.id),
        ).rejects.toThrow(
          "- Au moins un créneau matos est nécessaire pour une demande matos",
        );
      });
    });
    describe("when there is more than one error", () => {
      it("should indicate all", () => {
        expect(
          async () => await askForReview.fromDraft(justCreated.id),
        ).rejects.toThrow("- Le lieu est nécessaire");
        expect(
          async () => await askForReview.fromDraft(justCreated.id),
        ).rejects.toThrow("- Une description est nécessaire");
        expect(
          async () => await askForReview.fromDraft(justCreated.id),
        ).rejects.toThrow("- Une équipe responsable est nécessaire");
      });
    });
    describe("when ask several time for a review", () => {
      beforeEach(() => {
        const festivalActivities =
          new InMemoryAskForReviewFestivalActivityRepository([
            InReviewFestivalActivity.init({ ...pcSecurite, status: DRAFT }),
          ]);
        const notifications = new InMemoryNotifications();
        askForReview = new AskForReview(festivalActivities, notifications);
      });
      it("should indicate that festival activity is already under review", async () => {
        expect(
          async () => await askForReview.fromDraft(pcSecurite.id),
        ).rejects.toThrow(Review.NotInDraft);
      });
    });
  });
});
