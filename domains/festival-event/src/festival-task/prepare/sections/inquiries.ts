import { UpdatedTask, PrepareFestivalTaskError } from "../prepare";
import {
  InquiryRequest,
  BaseInquiryRequest,
} from "../../../common/inquiry-request";
import { DRAFT, IN_REVIEW, REFUSED } from "../../../common/status";
import { InReviewSpecification } from "../../ask-for-review/in-review-specification";
import { FestivalTask } from "../../festival-task";
import {
  GearAlreadyRequested,
  FestivalTaskError,
} from "../../festival-task.error";

export class Inquiries {
  private constructor(private inquiries: InquiryRequest[]) {}

  static build(inquiries: InquiryRequest[]) {
    return new Inquiries(inquiries);
  }

  add(inquiry: BaseInquiryRequest) {
    if (this.has(inquiry)) throw new GearAlreadyRequested(inquiry.name);

    return new Inquiries([...this.inquiries, inquiry]);
  }

  remove(slug: InquiryRequest["slug"]) {
    const inquiries = this.inquiries.filter((inquiry) => inquiry.slug !== slug);

    return new Inquiries(inquiries);
  }

  private has(inquiry: InquiryRequest): boolean {
    return this.inquiries.some(({ slug }) => slug === inquiry.slug);
  }

  get json(): InquiryRequest[] {
    return [...this.inquiries];
  }
}
export function checkValidity<
  T extends UpdatedTask<"general" | "mobilizations" | "instructions">,
>(task: T): FestivalTask {
  switch (task.status) {
    case DRAFT:
      return task;
    case IN_REVIEW:
    case REFUSED: {
      if (!InReviewSpecification.isSatisfiedBy(task)) {
        const errors = InReviewSpecification.generateErrors(task);
        throw new PrepareFestivalTaskError(errors);
      }
      return task;
    }
    default:
      throw new FestivalTaskError("Pas encore supporté");
  }
}
