import { InquiryWithTimeWindows } from "../in-review-festival-activity.model";
import { InquirySection } from "../../festival-activity.core";
import { InquiryWithRequests } from "../in-review-festival-activity.model";

const REQUIRED_INQUIRY_WITH_TIMEWINDOWS =
  "Au moins une demande de matos est nécessaire pour un créneau matos";
const REQUIRED_TIMEWINDOWS_WITH_INQUIRY =
  "Au moins un créneau matos est nécessaire pour une demande matos";

type WithTimeWindowsInquirySection = InquiryWithTimeWindows &
  Omit<InquirySection, "timeWindows">;

type WithRequestsInquirySection = InquiryWithRequests &
  Pick<InquirySection, "timeWindows">;

function isWithTimeWindows(
  section: InquirySection,
): section is WithTimeWindowsInquirySection {
  return section.timeWindows.length > 0;
}

function isWithRequest(
  section: InquirySection,
): section is WithRequestsInquirySection {
  const inquiriesCount =
    section.barriers.length + section.electricity.length + section.gears.length;
  return inquiriesCount > 0;
}

class ActivityInquiryWithTimeWindowsSpecification {
  static errors(section: WithTimeWindowsInquirySection): string[] {
    const inquiriesCount =
      section.barriers.length +
      section.gears.length +
      section.electricity.length;
    return inquiriesCount > 0 ? [] : [REQUIRED_INQUIRY_WITH_TIMEWINDOWS];
  }
}

class ActivityInquiryWithRequestSpecification {
  static errors(section: WithRequestsInquirySection): string[] {
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
