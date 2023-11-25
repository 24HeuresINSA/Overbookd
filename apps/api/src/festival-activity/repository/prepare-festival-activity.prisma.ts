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

type DatabasePreview = Pick<FestivalActivity, "id" | "status"> & {
  general: {
    name: FestivalActivity["general"]["name"];
  };
  inCharge: {
    team: FestivalActivity["inCharge"]["team"];
    adherent: FestivalActivity["inCharge"]["adherent"];
  };
  reviews: InReview["reviews"];
};

type DatabaseInquiryRequest = InquiryRequest & {
  catalogItem: {
    category: {
      owner: { code: string };
    };
  };
};

type DatabaseFestivalActivity = Omit<FestivalActivity, "status" | "inquiry"> & {
  status: FestivalActivity["status"];
  inquiry: {
    timeWindows: FestivalActivity["inquiry"]["timeWindows"];
    requests: DatabaseInquiryRequest[];
  };
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
    return activities.map(this.formatPreview);
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

  private formatPreview(activity: DatabasePreview): PreviewFestivalActivity {
    return {
      id: activity.id,
      status: activity.status,
      name: activity.general.name,
      team: activity.inCharge.team,
      adherent: activity.inCharge.adherent,
      reviews: activity.reviews,
    };
  }

  private formatFestivalActivity(
    activity: DatabaseFestivalActivity,
  ): FestivalActivity {
    const gears = activity.inquiry.requests.filter(
      (request) => request.catalogItem.category.owner.code === "matos",
    );
    const barriers = activity.inquiry.requests.filter(
      (request) => request.catalogItem.category.owner.code === "barrieres",
    );
    const electricity = activity.inquiry.requests.filter(
      (request) => request.catalogItem.category.owner.code === "elec",
    );

    return {
      ...activity,
      inquiry: {
        timeWindows: activity.inquiry.timeWindows,
        gears,
        barriers,
        electricity,
      },
    } as FestivalActivity;
  }
}
