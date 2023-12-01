import { beforeEach, describe, expect, it } from "vitest";
import {
  Reviewer,
  barrieres,
  communication,
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
import { george, lea } from "../festival-activity.fake";

function isReviewer(team: string): team is Reviewer {
  return [barrieres, communication, elec, humain, matos, secu, signa].includes(
    team,
  );
}

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
      it("should generate a Festival Activity Ready To Review event", async () => {
        const instigatorId = lea.id;
        const readyToReview = await askForReview.fromDraft(
          pcSecurite.id,
          instigatorId,
        );

        expect(readyToReview.by).toBe(instigatorId);
        expect(readyToReview.at).toStrictEqual(expect.any(Date));
        expect(readyToReview.at.getMilliseconds()).toBe(0);
        expect(readyToReview.id).toStrictEqual(expect.any(Number));
      });
      describe("generated festival activity", () => {
        it("should indicate it is reviewable", async () => {
          const { festivalActivity: inReviewFa } = await askForReview.fromDraft(
            pcSecurite.id,
            lea.id,
          );
          expect(inReviewFa.status).toBe(IN_REVIEW);
        });
        it("should keep draft festival activity sections", async () => {
          const { festivalActivity: inReviewFa } = await askForReview.fromDraft(
            pcSecurite.id,
            lea.id,
          );

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
            const { festivalActivity: inReviewFa } =
              await askForReview.fromDraft(pcSecurite.id, lea.id);

            const event = { id: inReviewFa.id, name: inReviewFa.general.name };
            const barrieresNotification = { team: barrieres, event };

            expect(notifications.entries).toHaveLength(6);
            expect(notifications.entries).toContainEqual({
              team: humain,
              event,
            });
            expect(notifications.entries).toContainEqual({
              team: signa,
              event,
            });
            expect(notifications.entries).toContainEqual({ team: secu, event });
            expect(notifications.entries).toContainEqual({
              team: matos,
              event,
            });
            expect(notifications.entries).toContainEqual({ team: elec, event });
            expect(notifications.entries).toContainEqual(barrieresNotification);
          });
          it.each`
            team             | status
            ${communication} | ${NOT_ASKING_TO_REVIEW}
            ${humain}        | ${REVIEWING}
            ${signa}         | ${REVIEWING}
            ${secu}          | ${REVIEWING}
            ${matos}         | ${REVIEWING}
            ${elec}          | ${REVIEWING}
            ${barrieres}     | ${REVIEWING}
          `("should explain $team is $status", async ({ team, status }) => {
            const { festivalActivity: inReviewFa } =
              await askForReview.fromDraft(pcSecurite.id, lea.id);
            if (!isReviewer(team)) throw new Error();
            // eslint-disable-next-line security/detect-object-injection
            expect(inReviewFa.reviews[team]).toBe(status);
          });
          describe("when it will be published (i.e. is public)", () => {
            it("should also ask review from communication", async () => {
              const { festivalActivity: inReviewFa } =
                await askForReview.fromDraft(finaleEsport.id, george.id);

              const event = {
                id: inReviewFa.id,
                name: inReviewFa.general.name,
              };
              const communicationNotification = { team: communication, event };
              const humainNotification = { team: humain, event };
              const signaNotification = { team: signa, event };
              const secuNotification = { team: secu, event };
              const matosNotification = { team: matos, event };
              const elecNotification = { team: elec, event };
              const barrieresNotification = { team: barrieres, event };

              expect(notifications.entries).toHaveLength(7);
              expect(notifications.entries).toContainEqual(
                communicationNotification,
              );
              expect(notifications.entries).toContainEqual(humainNotification);
              expect(notifications.entries).toContainEqual(signaNotification);
              expect(notifications.entries).toContainEqual(secuNotification);
              expect(notifications.entries).toContainEqual(matosNotification);
              expect(notifications.entries).toContainEqual(elecNotification);
              expect(notifications.entries).toContainEqual(
                barrieresNotification,
              );
            });
            it.each`
              team             | status
              ${communication} | ${REVIEWING}
              ${humain}        | ${REVIEWING}
              ${signa}         | ${REVIEWING}
              ${secu}          | ${REVIEWING}
              ${matos}         | ${REVIEWING}
              ${elec}          | ${REVIEWING}
              ${barrieres}     | ${REVIEWING}
            `(
              "should explain $team is concern with review",
              async ({ team, status }) => {
                const { festivalActivity: inReviewFa } =
                  await askForReview.fromDraft(finaleEsport.id, george.id);
                if (!isReviewer(team)) throw new Error();
                // eslint-disable-next-line security/detect-object-injection
                expect(inReviewFa.reviews[team]).toBe(status);
              },
            );
          });
        });

        describe("when festival activity will be published (i.e. is public)", () => {
          it("should also ask review from communication", async () => {
            const { festivalActivity: inReviewFa } =
              await askForReview.fromDraft(finaleEsport.id, george.id);
            expect(notifications.entries).toHaveLength(7);
            const event = { id: inReviewFa.id, name: inReviewFa.general.name };
            expect(notifications.entries).toContainEqual({
              team: communication,
              event,
            });
            expect(notifications.entries).toContainEqual({
              team: humain,
              event,
            });
            expect(notifications.entries).toContainEqual({
              team: signa,
              event,
            });
            expect(notifications.entries).toContainEqual({ team: secu, event });
            expect(notifications.entries).toContainEqual({
              team: matos,
              event,
            });
            expect(notifications.entries).toContainEqual({ team: elec, event });
            expect(notifications.entries).toContainEqual({
              team: barrieres,
              event,
            });
          });
        });
      });
    });
    describe("when not providing a description", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(internalWithoutDescription.id, lea.id),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate description is required", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(internalWithoutDescription.id, lea.id),
        ).rejects.toThrow("- Une description est nécessaire");
      });
    });
    describe("when not providing a photolink on a public activity", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(publicWithoutPhoto.id, lea.id),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate photoLink is required on public activity", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(publicWithoutPhoto.id, lea.id),
        ).rejects.toThrow(
          "- Une photo est nécessaire pour les animations publiées",
        );
      });
    });
    describe("when not providing any category on a public activity", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(publicWithoutCategory.id, lea.id),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate categories require at least one element on public activity", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(publicWithoutCategory.id, lea.id),
        ).rejects.toThrow(
          "- Au moins une catégorie est nécessaire pour les animations publiées",
        );
      });
    });
    describe("when not providing any timewindows on a public activity", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(publicWithoutTimeWindows.id, lea.id),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate timeWindows require at least one element on public activity", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(publicWithoutTimeWindows.id, lea.id),
        ).rejects.toThrow(
          "- Au moins un créneau horaire est nécessaire pour les animations publiées",
        );
      });
    });
    describe("when not providing team in charge", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(
              internalWithoutTeamInCharge.id,
              lea.id,
            ),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate team in charge is required", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(
              internalWithoutTeamInCharge.id,
              lea.id,
            ),
        ).rejects.toThrow("- Une équipe responsable est nécessaire");
      });
    });
    describe("when not providing a location", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(internalWithoutLocation.id, lea.id),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate location is required", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(internalWithoutLocation.id, lea.id),
        ).rejects.toThrow("- Le lieu est nécessaire");
      });
    });
    describe("when there is at least one timeWindows but not any inquiries provided", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(internalWithoutInquiries.id, lea.id),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate at least one inquiry is required", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(internalWithoutInquiries.id, lea.id),
        ).rejects.toThrow(
          "- Au moins une demande de matos est nécessaire pour un créneau matos",
        );
      });
    });
    describe("when there is at least one inquiry from gear, barriers or electricity but not any timeWindows provided", () => {
      it("should indicate can't ask for review", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(
              internalWithoutInquiryTimeWindows.id,
              lea.id,
            ),
        ).rejects.toThrow(CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE);
      });
      it("should indicate timeWindows is required", async () => {
        expect(
          async () =>
            await askForReview.fromDraft(
              internalWithoutInquiryTimeWindows.id,
              lea.id,
            ),
        ).rejects.toThrow(
          "- Au moins un créneau matos est nécessaire pour une demande matos",
        );
      });
    });
    describe("when there is more than one error", () => {
      it("should indicate all", () => {
        expect(
          async () => await askForReview.fromDraft(justCreated.id, lea.id),
        ).rejects.toThrow("- Le lieu est nécessaire");
        expect(
          async () => await askForReview.fromDraft(justCreated.id, lea.id),
        ).rejects.toThrow("- Une description est nécessaire");
        expect(
          async () => await askForReview.fromDraft(justCreated.id, lea.id),
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
          async () => await askForReview.fromDraft(pcSecurite.id, lea.id),
        ).rejects.toThrow(Review.NotInDraft);
      });
    });
  });
});
