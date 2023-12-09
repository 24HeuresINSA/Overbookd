import {
  BARRIERES,
  DRAFT,
  Draft,
  ELEC,
  FestivalActivity,
  FestivalActivityWithoutStatus,
  IN_REVIEW,
  Reviewable,
  ReviewableSpecification,
  InquiryRequest,
  MATOS,
  NOT_ASKING_TO_REVIEW,
  PreviewDraft,
  PreviewFestivalActivity,
  PreviewReviewable,
  ReviewStatus,
  Reviewer,
  barrieres,
  communication,
  elec,
  humain,
  matos,
  secu,
  signa,
  isValidatedReviews,
  VALIDATED,
  isRefusedReviews,
  REFUSED,
} from "@overbookd/festival-activity";

type DatabaseReview = {
  team: Reviewer;
  status: ReviewStatus;
};

type DatabaseGeneral = Omit<FestivalActivity["general"], "timeWindows"> & {
  generalTimeWindows: FestivalActivity["general"]["timeWindows"];
};

type DatabaseInCharge = Omit<FestivalActivity["inCharge"], "team"> & {
  teamCode: FestivalActivity["inCharge"]["team"];
};

type DatabaseInquiryRequest = {
  slug: InquiryRequest["slug"];
  quantity: InquiryRequest["quantity"];
  drive: string | null;
  catalogItem: {
    name: InquiryRequest["name"];
    category: { owner: { code: string } };
  };
};

type DatabaseInquiry = {
  inquiryTimeWindows: FestivalActivity["inquiry"]["timeWindows"];
  inquiries: DatabaseInquiryRequest[];
};

type DatabaseFestivalActivity = DatabaseGeneral &
  DatabaseInCharge &
  FestivalActivity["signa"] &
  FestivalActivity["security"] &
  FestivalActivity["supply"] &
  DatabaseInquiry & {
    id: FestivalActivity["id"];
    status: FestivalActivity["status"];
    reviews: DatabaseReview[];
    feedbacks: FestivalActivity["feedbacks"];
  };

type VisualizeFestivalActivity<
  Activity extends FestivalActivity = FestivalActivity,
  Preview extends PreviewFestivalActivity = PreviewFestivalActivity,
> = {
  preview: Preview;
  festivalActivity: Activity;
};

export class FestivalActivityBuilder<T extends FestivalActivity> {
  constructor(protected readonly activity: T) {}

  static fromDatabase(
    activityData: DatabaseFestivalActivity,
  ): VisualizeFestivalActivity {
    const activityWithoutStatus = this.buildActivityWithoutStatus(activityData);

    switch (activityData.status) {
      case DRAFT:
        return DraftBuilder.init(activityWithoutStatus);
      case IN_REVIEW:
      case VALIDATED:
      case REFUSED:
        return ReviewableBuilder.init(activityWithoutStatus);
    }
  }

  protected static buildActivityWithoutStatus(
    activityData: DatabaseFestivalActivity,
  ) {
    const activityWithoutStatus = {
      id: activityData.id,
      reviews: this.formatReviews(activityData.reviews),
      general: {
        name: activityData.name,
        description: activityData.description,
        categories: activityData.categories,
        toPublish: activityData.toPublish,
        isFlagship: activityData.isFlagship,
        photoLink: activityData.photoLink,
        timeWindows: activityData.generalTimeWindows,
      },
      inCharge: {
        team: activityData.teamCode,
        adherent: activityData.adherent,
        contractors: activityData.contractors,
      },
      signa: {
        location: activityData.location,
        signages: activityData.signages,
      },
      security: {
        specialNeed: activityData.specialNeed,
      },
      supply: {
        electricity: activityData.electricity,
        water: activityData.water,
      },
      inquiry: this.formatInquiry(activityData),
      feedbacks: activityData.feedbacks,
    };
    return activityWithoutStatus;
  }

  private static formatInquiry(activity: DatabaseFestivalActivity) {
    const gears = activity.inquiries
      .filter((req) => req.catalogItem.category.owner.code === MATOS)
      .map(this.formatInquiryRequest);

    const barriers = activity.inquiries
      .filter((req) => req.catalogItem.category.owner.code === BARRIERES)
      .map(this.formatInquiryRequest);

    const electricity = activity.inquiries
      .filter((req) => req.catalogItem.category.owner.code === ELEC)
      .map(this.formatInquiryRequest);

    return {
      timeWindows: activity.inquiryTimeWindows,
      gears,
      barriers,
      electricity,
    };
  }

  private static formatInquiryRequest(
    request: DatabaseInquiryRequest,
  ): InquiryRequest {
    const drive = request.drive ? { drive: request.drive } : {};
    return {
      slug: request.slug,
      name: request.catalogItem.name,
      quantity: request.quantity,
      ...drive,
    };
  }

  private static formatReviews(reviews: DatabaseReview[]) {
    if (reviews.length === 0) return {};
    return {
      humain: this.findReviewStatusByTeam(reviews, humain),
      signa: this.findReviewStatusByTeam(reviews, signa),
      barrieres: this.findReviewStatusByTeam(reviews, barrieres),
      communication: this.findReviewStatusByTeam(reviews, communication),
      elec: this.findReviewStatusByTeam(reviews, elec),
      matos: this.findReviewStatusByTeam(reviews, matos),
      secu: this.findReviewStatusByTeam(reviews, secu),
    };
  }

  private static findReviewStatusByTeam(
    reviews: DatabaseReview[],
    reviewer: Reviewer,
  ): ReviewStatus {
    const review = reviews.find((review) => review.team === reviewer);
    return review?.status ?? NOT_ASKING_TO_REVIEW;
  }
}

class ReviewableBuilder
  extends FestivalActivityBuilder<Reviewable>
  implements VisualizeFestivalActivity<Reviewable, PreviewReviewable>
{
  static init(activityWithoutStatus: FestivalActivityWithoutStatus) {
    if (!ReviewableSpecification.isSatisfiedBy(activityWithoutStatus)) {
      return DraftBuilder.init(activityWithoutStatus);
    }
    const { reviews } = activityWithoutStatus;

    if (isValidatedReviews(reviews)) {
      return new ReviewableBuilder({
        ...activityWithoutStatus,
        status: VALIDATED,
        reviews,
      });
    }
    if (isRefusedReviews(reviews)) {
      return new ReviewableBuilder({
        ...activityWithoutStatus,
        status: REFUSED,
        reviews,
      });
    }

    return new ReviewableBuilder({
      ...activityWithoutStatus,
      status: IN_REVIEW,
      reviews,
    });
  }

  get preview(): PreviewReviewable {
    const base = {
      id: this.activity.id,
      name: this.activity.general.name,
      adherent: this.activity.inCharge.adherent,
      team: this.activity.inCharge.team,
    };
    const { reviews } = this.activity;

    if (isValidatedReviews(reviews)) {
      return { ...base, reviews, status: VALIDATED };
    }
    if (isRefusedReviews(reviews)) {
      return { ...base, reviews, status: REFUSED };
    }

    return { ...base, status: IN_REVIEW, reviews };
  }

  get festivalActivity() {
    return this.activity;
  }
}

export class DraftBuilder
  extends FestivalActivityBuilder<Draft>
  implements VisualizeFestivalActivity<Draft, PreviewDraft>
{
  static init(activityWithoutStatus: FestivalActivityWithoutStatus) {
    return new DraftBuilder({ ...activityWithoutStatus, status: DRAFT });
  }

  static fromDatabase(
    activityData: DatabaseFestivalActivity,
  ): VisualizeFestivalActivity<Draft, PreviewDraft> {
    const activityWithoutStatus = this.buildActivityWithoutStatus(activityData);
    return this.init(activityWithoutStatus);
  }

  get preview() {
    return {
      id: this.activity.id,
      name: this.activity.general.name,
      status: this.activity.status,
      adherent: this.activity.inCharge.adherent,
      team: this.activity.inCharge.team,
    };
  }

  get festivalActivity() {
    return this.activity;
  }
}
