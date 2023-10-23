import { describe, expect, it } from "vitest";
import { DraftFestivalActivity } from "../creation/draft-festival-activity";
import {
  InReviewFestivalActivity,
  barrieres,
  comcom,
  elec,
  humain,
  matos,
  secu,
  signa,
} from "./in-review-festival-activity";
import { CANT_MOVE_TO_IN_REVIEW_ERROR_MESSAGE } from "./ready-for-review.error";
import { IN_REVIEW } from "../festival-activity.core";
import { FestivalActivityRepository } from "../festival-activity.repository";
import { InMemoryFestivalActivityRepository } from "../festival-activity-repository.inmemory";
import { FestivalActivityNotFound, Review } from "../festival-activity.error";
import { isDraft } from "../festival-activity.model";

const robocop = {
  id: 1,
  nickname: "Robocop",
  firstname: "Secu",
  lastname: "Rite",
};
const faker = {
  id: 2,
  nickname: "Faker",
  firstname: "Lee",
  lastname: "Sang-hyeok",
};
const dixCadenasPompier = { id: 1, name: "Cadenas Pompier", quantity: 10 };
const uneBouilloire = { id: 2, name: "Bouilloire", quantity: 1 };
const uneMultiprise = { id: 3, name: "Multiprise", quantity: 1 };
const pcSecurite = {
  id: 1,
  general: {
    name: "PC Securite",
    description: "Tour de guet",
    categories: [],
    toPublish: false,
    photoLink: null,
    isFlagship: false,
    timeWindows: [],
  },
  inCharge: {
    adherent: robocop,
    team: "secu",
    contractors: [],
  },
  signa: {
    location: "Pas tes oignons",
    signages: [],
  },
  security: {
    specialNeed: "Une armee d'AS super malin",
  },
  inquiry: {
    timeWindows: [
      {
        start: new Date("2023-05-12 09:00"),
        end: new Date("2023-05-15 08:00"),
      },
    ],
    gears: [dixCadenasPompier, uneBouilloire],
    electricity: [],
    barriers: [],
  },
  supply: {
    electricity: [],
    water: null,
  },
};

const finaleEsport = {
  id: 2,
  general: {
    name: "Finale esport",
    description:
      "Après une année de championnat de légende venez assister à la conclusion de cette saison !",
    categories: ["sport"],
    toPublish: true,
    photoLink:
      "https://tse1.mm.bing.net/th?id=OIP.Gic1SK5Di5WzX5l_Y2bQtAHaEK&pid=Api",
    isFlagship: true,
    timeWindows: [
      {
        start: new Date("2023-05-13 19:00"),
        end: new Date("2023-05-14 01:00"),
        id: "2-202305131900-202305140100",
      },
    ],
  },
  inCharge: {
    adherent: faker,
    team: "plazir",
    contractors: [],
  },
  signa: {
    location: "Amphi 3000",
    signages: [],
  },
  security: {
    specialNeed: "Une armee d'AS super malin",
  },
  inquiry: {
    timeWindows: [
      {
        start: new Date("2023-05-12 09:00"),
        end: new Date("2023-05-15 08:00"),
      },
    ],
    gears: [uneMultiprise],
    electricity: [],
    barriers: [],
  },
  supply: {
    electricity: [],
    water: null,
  },
};

const internalWithoutDescription = {
  ...pcSecurite,
  id: 3,
  general: { ...pcSecurite.general, description: null },
};

const publicWithoutPhoto = {
  ...finaleEsport,
  id: 4,
  general: { ...finaleEsport.general, photoLink: null },
};

const publicWithoutCategory = {
  ...finaleEsport,
  id: 5,
  general: { ...finaleEsport.general, categories: [] },
};

const publicWithoutTimeWindows = {
  ...finaleEsport,
  id: 6,
  general: { ...finaleEsport.general, timeWindows: [] },
};

const internalWithoutTeamInCharge = {
  ...pcSecurite,
  id: 7,
  inCharge: { ...pcSecurite.inCharge, team: null },
};

const internalWithoutLocation = {
  ...pcSecurite,
  id: 8,
  signa: { ...pcSecurite.signa, location: null },
};

const internalWithoutInquiries = {
  ...pcSecurite,
  id: 9,
  inquiry: { ...pcSecurite.inquiry, gears: [] },
};

const internalWithoutInquiryTimeWindows = {
  ...pcSecurite,
  id: 10,
  inquiry: { ...pcSecurite.inquiry, timeWindows: [] },
};

const justCreated = {
  id: 11,
  inCharge: {
    adherent: robocop,
    team: null,
    contractors: [],
  },
  general: {
    name: "Test",
    description: null,
    categories: [],
    toPublish: false,
    photoLink: null,
    isFlagship: false,
    timeWindows: [],
  },
  signa: { location: null, signages: [] },
  security: { specialNeed: null },
  supply: { electricity: [], water: null },
  inquiry: { timeWindows: [], gears: [], barriers: [], electricity: [] },
};

class AskForReview {
  constructor(
    private readonly festivalActivities: FestivalActivityRepository,
  ) {}

  async fromDraft(draftId: number): Promise<InReviewFestivalActivity> {
    const festivalActivity = await this.festivalActivities.findById(draftId);
    if (!festivalActivity) throw new FestivalActivityNotFound(draftId);
    if (!isDraft(festivalActivity)) throw new Review.NotInDraft(draftId);

    return Promise.resolve(festivalActivity.askForReview());
  }
}

describe("Ask for review", () => {
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
  const askForReview = new AskForReview(festivalActivities);
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
  });
});
