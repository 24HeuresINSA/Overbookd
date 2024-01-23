import { InquiryRequest } from "@overbookd/festival-event";

export type AddInquiryRequestForm = Pick<InquiryRequest, "slug" | "quantity">;
