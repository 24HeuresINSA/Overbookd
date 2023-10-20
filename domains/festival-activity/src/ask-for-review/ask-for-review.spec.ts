import { describe, expect, it } from "vitest";
import { DraftFestivalActivity } from "../creation/draft-festival-activity";
import { InReviewFestivalActivity } from "../creation/in-review-festival-activity";
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
const dixCadenasPompier = { id: 1, name: "Cadenas Pompier", quantity: 10 };
const uneBouilloire = { id: 2, name: "Bouilloire", quantity: 1 };
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
    [pcSecurite].map(DraftFestivalActivity.build),
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
    });
  });
});
