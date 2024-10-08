import {
  InquiryRequest,
  BaseInquiryRequest,
  AssignDrive,
} from "../../../common/inquiry-request.js";
import { GearAlreadyRequested } from "../../festival-task.error.js";

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

  assignToDrive(link: AssignDrive) {
    const inquiries = this.inquiries.map((inquiry) =>
      inquiry.slug === link.slug ? { ...inquiry, drive: link.drive } : inquiry,
    );

    return new Inquiries(inquiries);
  }

  private has(inquiry: InquiryRequest): boolean {
    return this.inquiries.some(({ slug }) => slug === inquiry.slug);
  }

  get json(): InquiryRequest[] {
    return [...this.inquiries];
  }
}
