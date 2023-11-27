import {
  FestivalActivity,
  InReview,
  InquiryRequest,
  PrepareFestivalActivityRepository,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";
import { PrismaService } from "../../prisma.service";
import {
  SELECT_FESTIVAL_ACTIVITY,
  SELECT_PREVIEW_FESTIVAL_ACTIVITY,
} from "../festival-activity.query";

type DatabasePreview = Omit<PreviewFestivalActivity, "team"> & {
  teamCode: FestivalActivity["inCharge"]["team"];
};

type DatabaseGeneral = Omit<
  FestivalActivity["general"],
  "team" | "timeWindows"
> & {
  teamCode: FestivalActivity["inCharge"]["team"];
  generalTimeWindows: FestivalActivity["general"]["timeWindows"];
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
  FestivalActivity["inCharge"] &
  FestivalActivity["inquiry"] &
  FestivalActivity["signa"] &
  FestivalActivity["security"] &
  FestivalActivity["supply"] &
  DatabaseInquiry & {
    id: FestivalActivity["id"];
    status: FestivalActivity["status"];
    reviews: InReview["reviews"];
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

  async findById(id: number): Promise<FestivalActivity> {
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
    return {
      id: activity.id,
      status: activity.status,
      name: activity.name,
      team: activity.teamCode,
      adherent: activity.adherent,
      reviews: activity.reviews,
    };
  }

  private formatFestivalActivity(
    activity: DatabaseFestivalActivity,
  ): FestivalActivity {
    return {
      id: activity.id,
      status: activity.status,
      reviews: activity.reviews,
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

  private formatInquirySection(
    inquiry: DatabaseInquiry,
  ): FestivalActivity["inquiry"] {
    const gears = inquiry.inquiries
      .filter((req) => req.catalogItem.category.owner.code === "matos")
      .map(this.formatInquiryRequest);

    const barriers = inquiry.inquiries
      .filter((req) => req.catalogItem.category.owner.code === "barrieres")
      .map(this.formatInquiryRequest);

    const electricity = inquiry.inquiries
      .filter((req) => req.catalogItem.category.owner.code === "elec")
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
}
