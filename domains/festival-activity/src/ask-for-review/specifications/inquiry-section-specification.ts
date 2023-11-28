import {
  WithTimeWindows,
  InquiryWithPotentialRequests,
  WithInquiries,
} from "../../sections/inquiry";

const REQUIRED_INQUIRY_WITH_TIMEWINDOWS =
  "Au moins une demande de matos est nécessaire pour un créneau matos";
const REQUIRED_TIMEWINDOWS_WITH_INQUIRY =
  "Au moins un créneau matos est nécessaire pour une demande matos";

type WithTimeWindowsAndPotentialInquiries = WithTimeWindows &
  Omit<InquiryWithPotentialRequests, "timeWindows">;

type WithInquiriesAndPotentialTimeWindows = WithInquiries &
  Pick<InquiryWithPotentialRequests, "timeWindows">;

function isWithTimeWindows(
  section: InquiryWithPotentialRequests,
): section is WithTimeWindowsAndPotentialInquiries {
  return section.timeWindows.length > 0;
}

function isWithRequest(
  section: InquiryWithPotentialRequests,
): section is WithInquiriesAndPotentialTimeWindows {
  const { barriers, electricity, gears } = section;
  const requests = barriers.length + electricity.length + gears.length;
  return requests > 0;
}

class ActivityInquiryWithTimeWindowsSpecification {
  static errors(section: WithTimeWindowsAndPotentialInquiries): string[] {
    if (isWithRequest(section)) {
      return [];
    }
    return [REQUIRED_INQUIRY_WITH_TIMEWINDOWS];
  }
}

class ActivityInquiryWithRequestSpecification {
  static errors(section: WithInquiriesAndPotentialTimeWindows): string[] {
    if (isWithTimeWindows(section)) {
      return [];
    }
    return [REQUIRED_TIMEWINDOWS_WITH_INQUIRY];
  }
}

export class ActivityInquirySpecification {
  static errors(section: InquiryWithPotentialRequests): string[] {
    if (isWithTimeWindows(section)) {
      return ActivityInquiryWithTimeWindowsSpecification.errors(section);
    }
    if (isWithRequest(section)) {
      return ActivityInquiryWithRequestSpecification.errors(section);
    }
    return [];
  }
}
