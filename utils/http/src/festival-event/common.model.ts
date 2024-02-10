import { Feedback } from "@overbookd/festival-event";
import { InquiryRequest } from "@overbookd/festival-event";

export type AddInquiryRequestForm = Pick<InquiryRequest, "slug" | "quantity">;

export type PrepareFeedbackPublish = Pick<Feedback, "content">;
