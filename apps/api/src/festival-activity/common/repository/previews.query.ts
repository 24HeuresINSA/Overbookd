import {
  APPROVED,
  FestivalActivity,
  IN_REVIEW,
  VALIDATED,
  secu,
} from "@overbookd/festival-event";

export const SELECT_PREVIEW_FOR_SECURITY_DASHBOARD = {
  id: true,
  name: true,
  teamCode: true,
  specialNeed: true,
  freePass: true,
  generalTimeWindows: { select: { start: true, end: true, id: true } },
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
  generalTimeWindows: { select: { start: true, end: true, id: true } },
  description: true,
  photoLink: true,
  isFlagship: true,
  categories: true,
};

export const SELECT_PREVIEW_FOR_LOGISTIC_DASHBOARD = {
  id: true,
  name: true,
  status: true,
  inquiryTimeWindows: { select: { start: true, end: true, id: true } },
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

export const SHOULD_BE_IN_LOGISTIC_DASHBOARD = {
  isDeleted: false,
  status: { in: [VALIDATED, IN_REVIEW] as FestivalActivity["status"][] },
};
