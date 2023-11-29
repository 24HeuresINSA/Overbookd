import {
  BARRIERES,
  DRAFT,
  Draft,
  ELEC,
  FestivalActivity,
  FestivalActivityWithoutStatus,
  IN_REVIEW,
  InReview,
  InReviewSpecification,
  InquiryRequest,
  MATOS,
  NOT_ASKING_TO_REVIEW,
  PreviewDraft,
  PreviewFestivalActivity,
  PreviewInReview,
  ReviewStatus,
  Reviewer,
  barrieres,
  comcom,
  elec,
  humain,
  matos,
  secu,
  signa,
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
  };

type VisualizeFestivalActivity = {
  preview: PreviewFestivalActivity;
  festivalActivity: FestivalActivity;
};

export class FestivalActivityBuilder<T extends FestivalActivity> {
  constructor(protected readonly activity: T) {}

  static fromDatabase(
    activityData: DatabaseFestivalActivity,
  ): VisualizeFestivalActivity {
    const reviews = this.formatReviews(activityData.reviews);

    const activityWithoutStatus = {
      id: activityData.id,
      ...reviews,
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
    };

    switch (activityData.status) {
      case DRAFT:
        return DraftBuilder.init(activityWithoutStatus);
      case IN_REVIEW:
        return InReviewBuilder.init(activityWithoutStatus);
    }
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
    return {
      slug: request.slug,
      name: request.catalogItem.name,
      quantity: request.quantity,
    };
  }

  private static formatReviews(reviews: DatabaseReview[]) {
    if (reviews.length === 0) return {};
    return {
      humain: this.findReviewStatusByTeam(reviews, humain),
      signa: this.findReviewStatusByTeam(reviews, signa),
      barrieres: this.findReviewStatusByTeam(reviews, barrieres),
      comcom: this.findReviewStatusByTeam(reviews, comcom),
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

class InReviewBuilder
  extends FestivalActivityBuilder<InReview>
  implements VisualizeFestivalActivity
{
  static init(activityWithoutStatus: FestivalActivityWithoutStatus) {
    return InReviewSpecification.isSatisfiedBy(activityWithoutStatus)
      ? new InReviewBuilder({ ...activityWithoutStatus, status: IN_REVIEW })
      : DraftBuilder.init(activityWithoutStatus);
  }

  get preview(): PreviewInReview {
    return {
      id: this.activity.id,
      name: this.activity.general.name,
      status: this.activity.status,
      adherent: this.activity.inCharge.adherent,
      team: this.activity.inCharge.team,
      reviews: this.activity.reviews,
    };
  }

  get festivalActivity(): InReview {
    return this.activity;
  }
}

class DraftBuilder
  extends FestivalActivityBuilder<Draft>
  implements VisualizeFestivalActivity
{
  static init(activityWithoutStatus: FestivalActivityWithoutStatus) {
    return new DraftBuilder({ ...activityWithoutStatus, status: DRAFT });
  }

  get preview(): PreviewDraft {
    return {
      id: this.activity.id,
      name: this.activity.general.name,
      status: this.activity.status,
      adherent: this.activity.inCharge.adherent,
      team: this.activity.inCharge.team,
    };
  }

  get festivalActivity(): Draft {
    return this.activity;
  }
}
