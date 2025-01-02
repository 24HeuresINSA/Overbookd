import { Feedback, InquiryRequest } from "@overbookd/festival-event";

export type AddInquiryRequestForm = Pick<InquiryRequest, "slug" | "quantity">;
export type UpdateInquiryRequestForm = Pick<InquiryRequest, "quantity">;

export type PublishFeedbackForm = Pick<Feedback, "content">;
