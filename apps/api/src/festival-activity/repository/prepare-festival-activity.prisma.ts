import {
  BARRIERES,
  DRAFT,
  ELEC,
  FestivalActivity,
  InReview,
  InquiryRequest,
  MATOS,
  NOT_ASKING_TO_REVIEW,
  PrepareFestivalActivityRepository,
  PreviewFestivalActivity,
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
import { PrismaService } from "../../prisma.service";
import {
  SELECT_FESTIVAL_ACTIVITY,
  SELECT_PREVIEW_FESTIVAL_ACTIVITY,
} from "../festival-activity.query";

type DatabaseReview = {
  team: Reviewer;
  status: ReviewStatus;
};

type DatabasePreview = Omit<PreviewFestivalActivity, "team" | "reviews"> & {
  teamCode: FestivalActivity["inCharge"]["team"];
  reviews: DatabaseReview[];
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

export class PrismaPrepareFestivalActivityRepository
  implements PrepareFestivalActivityRepository
{
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<PreviewFestivalActivity[]> {
    const activities = await this.prisma.festivalActivity.findMany({
      select: SELECT_PREVIEW_FESTIVAL_ACTIVITY,
    });
    return activities.map(this.formatPreviewFestivalActivity);
  }

  async findById(id: FestivalActivity["id"]): Promise<FestivalActivity> {
    const activity = await this.prisma.festivalActivity.findUnique({
      where: { id },
      select: SELECT_FESTIVAL_ACTIVITY,
    });
    return this.formatFestivalActivity(activity);
  }

  async save(activity: FestivalActivity): Promise<FestivalActivity> {
    // TODO: save activity in database
    return activity;
  }

  private formatPreviewFestivalActivity(
    activity: DatabasePreview,
  ): PreviewFestivalActivity {
    const reviews = this.isDraft(activity)
      ? {}
      : this.formatReviews(activity.reviews);

    return {
      id: activity.id,
      status: activity.status,
      name: activity.name,
      team: activity.teamCode,
      adherent: activity.adherent,
      ...reviews,
    } as PreviewFestivalActivity;
  }

  private formatFestivalActivity(
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
      inquiry: this.formatInquirySection(activity),
    } as FestivalActivity;
  }

  private formatReviews(
    reviews: DatabaseReview[],
  ): InReview["reviews"] | undefined {
    if (reviews.length === 0) return undefined;
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

  private findReviewStatusByTeam(
    reviews: DatabaseReview[],
    team: Reviewer,
  ): ReviewStatus {
    const review = reviews.find((review) => review.team === team);
    return review?.status ?? NOT_ASKING_TO_REVIEW;
  }

  private formatInquirySection(
    inquiry: DatabaseInquiry,
  ): FestivalActivity["inquiry"] {
    const gears = inquiry.inquiries
      .filter((req) => req.catalogItem.category.owner.code === MATOS)
      .map(this.formatInquiryRequest);

    const barriers = inquiry.inquiries
      .filter((req) => req.catalogItem.category.owner.code === BARRIERES)
      .map(this.formatInquiryRequest);

    const electricity = inquiry.inquiries
      .filter((req) => req.catalogItem.category.owner.code === ELEC)
      .map(this.formatInquiryRequest);

    return {
      timeWindows: inquiry.inquiryTimeWindows,
      gears,
      barriers,
      electricity,
    };
  }

  private formatInquiryRequest(
    request: DatabaseInquiryRequest,
  ): InquiryRequest {
    return {
      slug: request.slug,
      name: request.catalogItem.name,
      quantity: request.quantity,
    };
  }

  private isDraft(
    activity: DatabaseFestivalActivity | DatabasePreview,
  ): boolean {
    return activity.status === DRAFT;
  }
}
