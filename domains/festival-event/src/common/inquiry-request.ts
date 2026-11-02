import type { Drive } from "@overbookd/festival-event-constants";

export type BaseInquiryRequest = {
  slug: string;
  quantity: number;
  name: string;
};

type WithDrive = {
  drive: Drive;
};

export type InquiryRequestAssigned = BaseInquiryRequest & WithDrive;

export type InquiryRequest = BaseInquiryRequest | InquiryRequestAssigned;

export function isAssignedToDrive(
  request: InquiryRequest,
): request is InquiryRequestAssigned {
  return Object.hasOwn(request, "drive");
}

export type AssignDrive = {
  slug: string;
  drive: Drive;
};
