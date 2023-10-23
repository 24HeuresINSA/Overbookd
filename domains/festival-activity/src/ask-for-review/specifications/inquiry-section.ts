import { InReviewWithTimeWindowsInquirySection } from "../in-review-festival-activity";
import { InquirySection } from "../../festival-activity.core";
import { InReviewWithRequestInquirySection } from "../in-review-festival-activity";

const REQUIRED_INQUIRY_WITH_TIMEWINDOWS =
  "Au moins une demande de matos est nécessaire pour un créneau matos";
const REQUIRED_TIMEWINDOWS_WITH_INQUIRY =
  "Au moins un créneau matos est nécessaire pour une demande matos";

function isWithTimeWindows(
  section: InquirySection,
): section is InReviewWithTimeWindowsInquirySection {
  return section.timeWindows.length > 0;
}

function isWithRequest(
  section: InquirySection,
): section is InReviewWithRequestInquirySection {
  const inquiriesCount =
    section.barriers.length + section.electricity.length + section.gears.length;
  return inquiriesCount > 0;
}

class ActivityInquiryWithTimeWindowsSpecification {
  static errors(section: InReviewWithTimeWindowsInquirySection): string[] {
    const inquiriesCount =
      section.barriers.length +
      section.gears.length +
      section.electricity.length;
    return inquiriesCount > 0 ? [] : [REQUIRED_INQUIRY_WITH_TIMEWINDOWS];
  }
}

class ActivityInquiryWithRequestSpecification {
  static errors(section: InReviewWithRequestInquirySection): string[] {
    return section.timeWindows.length > 0
      ? []
      : [REQUIRED_TIMEWINDOWS_WITH_INQUIRY];
  }
}

export class ActivityInquirySpecification {
  static errors(section: InquirySection): string[] {
    if (isWithTimeWindows(section)) {
      return ActivityInquiryWithTimeWindowsSpecification.errors(section);
    }
    if (isWithRequest(section)) {
      return ActivityInquiryWithRequestSpecification.errors(section);
    }
    return [];
  }
}
