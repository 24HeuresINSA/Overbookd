import { APPROVED, secu } from "@overbookd/festival-activity";

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
  name: true,
  generalTimeWindows: { select: { start: true, end: true, id: true } },
  description: true,
  photoLink: true,
  isFlagship: true,
  categories: true,
};
