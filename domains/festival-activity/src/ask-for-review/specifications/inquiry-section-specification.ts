import { InquiryWithTimeWindows } from "../../festival-activity.core";
import { InquirySectionWithPotentialRequests } from "../../festival-activity.core";
import { InquiryWithRequests } from "../../festival-activity.core";

const REQUIRED_INQUIRY_WITH_TIMEWINDOWS =
  "Au moins une demande de matos est nécessaire pour un créneau matos";
const REQUIRED_TIMEWINDOWS_WITH_INQUIRY =
  "Au moins un créneau matos est nécessaire pour une demande matos";

type WithTimeWindowsInquirySection = InquiryWithTimeWindows &
  Omit<InquirySectionWithPotentialRequests, "timeWindows">;

type WithRequestsInquirySection = InquiryWithRequests &
  Pick<InquirySectionWithPotentialRequests, "timeWindows">;

function isWithTimeWindows(
  section: InquirySectionWithPotentialRequests,
): section is WithTimeWindowsInquirySection {
  return section.timeWindows.length > 0;
}

function isWithRequest(
  section: InquirySectionWithPotentialRequests,
): section is WithRequestsInquirySection {
  const { barriers, electricity, gears } = section;
  const requests = barriers.length + electricity.length + gears.length;
  return requests > 0;
}

class ActivityInquiryWithTimeWindowsSpecification {
  static errors(section: WithTimeWindowsInquirySection): string[] {
    if (isWithRequest(section)) {
      return [];
    }
    return [REQUIRED_INQUIRY_WITH_TIMEWINDOWS];
  }
}

class ActivityInquiryWithRequestSpecification {
  static errors(section: WithRequestsInquirySection): string[] {
    if (isWithTimeWindows(section)) {
      return [];
    }
    return [REQUIRED_TIMEWINDOWS_WITH_INQUIRY];
  }
}

export class ActivityInquirySpecification {
  static errors(section: InquirySectionWithPotentialRequests): string[] {
    if (isWithTimeWindows(section)) {
      return ActivityInquiryWithTimeWindowsSpecification.errors(section);
    }
    if (isWithRequest(section)) {
      return ActivityInquiryWithRequestSpecification.errors(section);
    }
    return [];
  }
}
