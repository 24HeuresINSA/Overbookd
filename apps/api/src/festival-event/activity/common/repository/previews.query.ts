import { APPROVED, FestivalActivity, secu } from "@overbookd/festival-event";
import {
  VALIDATED,
  IN_REVIEW,
  DRAFT,
} from "@overbookd/festival-event-constants";
import { SELECT_PERIOD_WITH_ID } from "../../../../common/query/period.query";
import { IS_NOT_DELETED } from "../../../../common/query/not-deleted.query";
import { SELECT_BASE_SIGNAGE } from "./festival-activity.query";

export const SELECT_PREVIEW_FOR_SECURITY_DASHBOARD = {
  id: true,
  name: true,
  teamCode: true,
  specialNeed: true,
  freePass: true,
  generalTimeWindows: { select: SELECT_PERIOD_WITH_ID },
};

export const SHOULD_BE_IN_SECURITY_DASHBOARD = {
  isDeleted: false,
  reviews: { some: { team: secu, status: APPROVED } as const },
  //                                                ^ Mandatory to match prisma type on review status
  OR: [{ specialNeed: { not: null } }, { freePass: { gt: 0 } }],
};

export const IS_PUBLIC = {
  toPublish: true,
};

export const SELECT_PREVIEW_FOR_COMMUNICATION_DASHBOARD = {
  id: true,
  status: true,
  name: true,
  generalTimeWindows: { select: SELECT_PERIOD_WITH_ID },
  description: true,
  photoLink: true,
  isFlagship: true,
  categories: true,
};

export const SELECT_PREVIEW_FOR_LOGISTIC = {
  id: true,
  name: true,
  status: true,
  inquiryTimeWindows: { select: SELECT_PERIOD_WITH_ID },
  inquiries: {
    select: {
      quantity: true,
      drive: true,
      catalogItem: {
        select: {
          slug: true,
          id: true,
          name: true,
          isPonctualUsage: true,
          isConsumable: true,
          category: {
            select: {
              name: true,
              path: true,
              id: true,
              owner: { select: { name: true, code: true } },
            },
          },
        },
      },
    },
  },
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

export const SHOULD_BE_IN_LOGISTIC_PREVIEW = {
  ...IS_NOT_DELETED,
  status: { in: [VALIDATED, IN_REVIEW] as FestivalActivity["status"][] },
  inquiries: { some: {} },
};

export const SHOULD_BE_IN_SIGNA_PREVIEW = {
  ...IS_NOT_DELETED,
  status: { not: DRAFT as FestivalActivity["status"] },
  signages: { some: {} },
};
