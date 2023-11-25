import {
  CreateFestivalActivityRepository,
  Draft,
  FestivalActivity,
  InquiryRequest,
} from "@overbookd/festival-activity";
import { PrismaService } from "../../prisma.service";
import { SELECT_DRAFT } from "../festival-activity.query";

type DatabaseInquiryRequest = InquiryRequest & {
  catalogItem: {
    category: {
      owner: { code: string };
    };
  };
};

type DatabaseDraft = Omit<Draft, "status" | "inquiry"> & {
  status: FestivalActivity["status"];
  inquiry: {
    timeWindows: Draft["inquiry"]["timeWindows"];
    requests: DatabaseInquiryRequest[];
  };
};

export class PrismaCreateFestivalActivityRepository
  implements CreateFestivalActivityRepository
{
  constructor(private prisma: PrismaService) {}

  async create(activity: Draft): Promise<Draft> {
    const draft = await this.prisma.festivalActivity.create({
      data: {
        id: activity.id,
        status: activity.status,
        general: {
          create: {
            name: activity.general.name,
            description: activity.general.description,
            categories: activity.general.categories,
            isFlagship: activity.general.isFlagship,
            photoLink: activity.general.photoLink,
            toPublish: activity.general.toPublish,
          },
        },
        inCharge: {
          create: {
            team: activity.inCharge.team,
            adherentId: activity.inCharge.adherent.id,
          },
        },
        signa: { create: { location: activity.signa.location } },
        security: { create: { specialNeed: activity.security.specialNeed } },
        supply: { create: { water: activity.supply.water } },
        inquiry: { create: {} },
      },
      select: SELECT_DRAFT,
    });
    return this.formatDraft(draft);
  }

  private formatDraft(draft: DatabaseDraft): Draft {
    const gears = draft.inquiry.requests.filter(
      (request) => request.catalogItem.category.owner.code === "matos",
    );
    const barriers = draft.inquiry.requests.filter(
      (request) => request.catalogItem.category.owner.code === "barrieres",
    );
    const electricity = draft.inquiry.requests.filter(
      (request) => request.catalogItem.category.owner.code === "elec",
    );

    return {
      ...draft,
      status: draft.status as Draft["status"],
      inquiry: {
        timeWindows: draft.inquiry.timeWindows,
        gears,
        barriers,
        electricity,
      },
    };
  }
}
