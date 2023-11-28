import { Draft } from "@overbookd/festival-activity";
import {
  Reviewer,
  ReviewStatus,
  PreviewFestivalActivity,
  FestivalActivity,
  InquiryRequest,
  BARRIERES,
  DRAFT,
  ELEC,
  InReview,
  MATOS,
  NOT_ASKING_TO_REVIEW,
  barrieres,
  comcom,
  elec,
  humain,
  matos,
  secu,
  signa,
} from "@overbookd/festival-activity";

export type DatabaseReview = {
  team: Reviewer;
  status: ReviewStatus;
};

export type DatabasePreview = Omit<
  PreviewFestivalActivity,
  "team" | "reviews"
> & {
  teamCode: FestivalActivity["inCharge"]["team"];
  reviews: DatabaseReview[];
};

type DatabaseGeneral = Omit<FestivalActivity["general"], "timeWindows"> & {
  generalTimeWindows: FestivalActivity["general"]["timeWindows"];
};

type DatabaseInCharge = Omit<FestivalActivity["inCharge"], "team"> & {
  teamCode: FestivalActivity["inCharge"]["team"];
};

export type DatabaseInquiryRequest = {
  slug: InquiryRequest["slug"];
  quantity: InquiryRequest["quantity"];
  catalogItem: {
    name: InquiryRequest["name"];
    category: { owner: { code: string } };
  };
};

export type DatabaseInquiry = {
  inquiryTimeWindows: FestivalActivity["inquiry"]["timeWindows"];
  inquiries: DatabaseInquiryRequest[];
};

export type DatabaseFestivalActivity = DatabaseGeneral &
  DatabaseInCharge &
  FestivalActivity["signa"] &
  FestivalActivity["security"] &
  FestivalActivity["supply"] &
  DatabaseInquiry & {
    id: FestivalActivity["id"];
    status: FestivalActivity["status"];
    reviews: DatabaseReview[];
  };

export type DatabaseDraft = DatabaseGeneral &
  DatabaseInCharge &
  FestivalActivity["signa"] &
  FestivalActivity["security"] &
  FestivalActivity["supply"] &
  DatabaseInquiry & {
    id: FestivalActivity["id"];
    status: Draft["status"];
  };

export function formatFestivalActivity(
  activity: DatabaseFestivalActivity,
): FestivalActivity {
  const reviews = this.isDraft(activity)
    ? {}
    : this.formatReviews(activity.reviews);

  return {
    id: activity.id,
    status: activity.status,
    ...reviews,
    general: {
      name: activity.name,
      description: activity.description,
      categories: activity.categories,
      toPublish: activity.toPublish,
      isFlagship: activity.isFlagship,
      photoLink: activity.photoLink,
      timeWindows: activity.generalTimeWindows,
    },
    inCharge: {
      team: activity.teamCode,
      adherent: activity.adherent,
      contractors: activity.contractors,
    },
    signa: {
      location: activity.location,
      signages: activity.signages,
    },
    security: {
      specialNeed: activity.specialNeed,
    },
    supply: {
      electricity: activity.electricity,
      water: activity.water,
    },
    inquiry: formatInquirySection(activity),
  } as FestivalActivity;
}

export function formatReviews(reviews: DatabaseReview[]): InReview["reviews"] {
  return {
    humain: findReviewStatusByTeam(reviews, humain),
    signa: findReviewStatusByTeam(reviews, signa),
    barrieres: findReviewStatusByTeam(reviews, barrieres),
    comcom: findReviewStatusByTeam(reviews, comcom),
    elec: findReviewStatusByTeam(reviews, elec),
    matos: findReviewStatusByTeam(reviews, matos),
    secu: findReviewStatusByTeam(reviews, secu),
  };
}

export function findReviewStatusByTeam(
  reviews: DatabaseReview[],
  team: Reviewer,
): ReviewStatus {
  const review = reviews.find((review) => review.team === team);
  return review?.status ?? NOT_ASKING_TO_REVIEW;
}

export function formatInquirySection(
  inquiry: DatabaseInquiry,
): FestivalActivity["inquiry"] {
  const gears = inquiry.inquiries
    .filter((req) => req.catalogItem.category.owner.code === MATOS)
    .map(formatInquiryRequest);

  const barriers = inquiry.inquiries
    .filter((req) => req.catalogItem.category.owner.code === BARRIERES)
    .map(formatInquiryRequest);

  const electricity = inquiry.inquiries
    .filter((req) => req.catalogItem.category.owner.code === ELEC)
    .map(formatInquiryRequest);

  return {
    timeWindows: inquiry.inquiryTimeWindows,
    gears,
    barriers,
    electricity,
  };
}

export function formatInquiryRequest(
  request: DatabaseInquiryRequest,
): InquiryRequest {
  return {
    slug: request.slug,
    name: request.catalogItem.name,
    quantity: request.quantity,
  };
}

export function isDraft(
  activity: DatabaseFestivalActivity | DatabasePreview,
): boolean {
  return activity.status === DRAFT;
}
