import { updateItemToList } from "@overbookd/list";
import {
  InquiryAlreadyExists,
  InquiryNotFound,
} from "../../../common/inquiry-request.error.js";
import {
  InquiryRequest,
  BaseInquiryRequest,
  AssignDrive,
} from "../../../common/inquiry-request.js";

export class Inquiries {
  private constructor(private inquiries: InquiryRequest[]) {}

  static build(inquiries: InquiryRequest[]) {
    return new Inquiries(inquiries);
  }

  add(inquiry: BaseInquiryRequest) {
    if (this.has(inquiry)) throw new InquiryAlreadyExists(inquiry.name);

    return new Inquiries([...this.inquiries, inquiry]);
  }

  update(inquiry: InquiryRequest) {
    const inquiryIndex = this.inquiries.findIndex(
      ({ slug }) => slug === inquiry.slug,
    );
    if (inquiryIndex === -1) throw new InquiryNotFound(inquiry.name);

    const inquiries = updateItemToList(this.inquiries, inquiryIndex, inquiry);
    return new Inquiries(inquiries);
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
