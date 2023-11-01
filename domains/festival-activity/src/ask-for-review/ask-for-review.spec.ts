import { beforeEach, describe, expect, it } from "vitest";
import { DraftFestivalActivity } from "../draft-festival-activity";
import {
  barrieres,
  comcom,
  elec,
  humain,
  matos,
  secu,
  signa,
} from "./waiting-for-review";
import { CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE } from "./ready-for-review.error";
import { DRAFT, IN_REVIEW } from "../festival-activity.core";
import { InMemoryFestivalActivityRepository } from "../festival-activity-repository.inmemory";
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

describe("Ask for review", () => {
  let askForReview: AskForReview;
  beforeEach(() => {
    const festivalActivities = new InMemoryFestivalActivityRepository(
      [
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
      ].map(DraftFestivalActivity.build),
    );
    askForReview = new AskForReview(festivalActivities);
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
      it("should ask review from humain, signa, secu, matos, elec and barrieres,", async () => {
        const inReviewFa = await askForReview.fromDraft(pcSecurite.id);
        expect(inReviewFa.readyForReview.id).toBe(inReviewFa.id);
        expect(inReviewFa.readyForReview.name).toBe(inReviewFa.general.name);
        expect(inReviewFa.readyForReview.reviewers).toContain(humain);
        expect(inReviewFa.readyForReview.reviewers).toContain(signa);
        expect(inReviewFa.readyForReview.reviewers).toContain(secu);
        expect(inReviewFa.readyForReview.reviewers).toContain(matos);
        expect(inReviewFa.readyForReview.reviewers).toContain(elec);
        expect(inReviewFa.readyForReview.reviewers).toContain(barrieres);
      });
      describe("when festival activity will be published (i.e. is public)", () => {
        it("should also ask review from comcom", async () => {
          const inReviewFa = await askForReview.fromDraft(finaleEsport.id);
          expect(inReviewFa.readyForReview.id).toBe(inReviewFa.id);
          expect(inReviewFa.readyForReview.name).toBe(inReviewFa.general.name);
          expect(inReviewFa.readyForReview.reviewers).toContain(comcom);
          expect(inReviewFa.readyForReview.reviewers).toContain(humain);
          expect(inReviewFa.readyForReview.reviewers).toContain(signa);
          expect(inReviewFa.readyForReview.reviewers).toContain(secu);
          expect(inReviewFa.readyForReview.reviewers).toContain(matos);
          expect(inReviewFa.readyForReview.reviewers).toContain(elec);
          expect(inReviewFa.readyForReview.reviewers).toContain(barrieres);
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
        const festivalActivities = new InMemoryFestivalActivityRepository([
          InReviewFestivalActivity.init({ ...pcSecurite, status: DRAFT }),
        ]);
        askForReview = new AskForReview(festivalActivities);
      });
      it("should indicate that festival activity is already under review", async () => {
        expect(
          async () => await askForReview.fromDraft(pcSecurite.id),
        ).rejects.toThrow(Review.NotInDraft);
      });
    });
  });
});
