import { FestivalActivity } from "@overbookd/festival-event";
import { APPROVED, DRAFT } from "@overbookd/festival-event-constants";
import { SELECT_PERIOD_WITH_ID } from "../../../../common/query/period.query";
import { IS_NOT_DELETED } from "../../../../common/query/not-deleted.query";
import { SELECT_BASE_SIGNAGE } from "./festival-activity.query";
import { SECU } from "@overbookd/team-constants";

const SELECT_BASE_PREVIEW = {
  id: true,
  name: true,
  status: true,
};

export type DatabasePreviewForLogistic = {
  id: number;
  name: string;
  status: FestivalActivity["status"];
  teamCode?: string;
  inquiries: {
    quantity: number;
    drive?: string;
    catalogItem: {
      slug: string;
      name: string;
      isPonctualUsage: boolean;
      isConsumable: boolean;
      category?: {
        path: string;
        name: string;
        owner?: {
          code: string;
          name: string;
        };
      };
    };
  }[];
};
export const SELECT_PREVIEW_FOR_LOGISTIC_DASHBOARD = {
  ...SELECT_BASE_PREVIEW,
  teamCode: true,
  inquiries: {
    select: {
      quantity: true,
      drive: true,
      catalogItem: {
        select: {
          slug: true,
          name: true,
          isPonctualUsage: true,
          isConsumable: true,
          category: {
            select: {
              path: true,
              name: true,
              owner: {
                select: { code: true, name: true },
              },
            },
          },
        },
      },
    },
  },
};

export const SELECT_PREVIEW_FOR_SECURITY_DASHBOARD = {
  ...SELECT_BASE_PREVIEW,
  teamCode: true,
  specialNeed: true,
  freePass: true,
  generalTimeWindows: { select: SELECT_PERIOD_WITH_ID },
};

export const SHOULD_BE_IN_SECURITY_DASHBOARD = {
  ...IS_NOT_DELETED,
  reviews: { some: { team: SECU, status: APPROVED } as const },
  //                                                ^ Mandatory to match prisma type on review status
  OR: [{ specialNeed: { not: null } }, { freePass: { gt: 0 } }],
};

export const IS_PUBLIC = {
  toPublish: true,
};

export const SELECT_PREVIEW_FOR_COMMUNICATION_DASHBOARD = {
  ...SELECT_BASE_PREVIEW,
  generalTimeWindows: { select: SELECT_PERIOD_WITH_ID },
  description: true,
  photoLink: true,
  isFlagship: true,
  categories: true,
};

export const SELECT_PREVIEW_FOR_SIGNA = {
  id: true,
  name: true,
  status: true,
  team: { select: { name: true } },
  location: { select: { name: true } },
  signages: {
    select: {
      ...SELECT_BASE_SIGNAGE,
      catalogItem: { select: { name: true } },
    },
  },
};

export const SHOULD_BE_IN_SIGNA_PREVIEW = {
  ...IS_NOT_DELETED,
  status: { not: DRAFT as FestivalActivity["status"] },
  signages: { some: {} },
};
