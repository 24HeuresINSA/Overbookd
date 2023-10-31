import { SignaSection } from "../../creation/draft-festival-activity.model";

const REQUIRED_LOCATION = "Le lieu est nécessaire";

export class ActivitySignaSpecification {
  static errors(section: SignaSection): string[] {
    if (this.hasLocationSet(section)) {
      return [];
    }
    return [REQUIRED_LOCATION];
  }

  private static hasLocationSet(section: SignaSection) {
    return section.location !== null;
  }
}
