import { DraftSignaSection } from "../../creation/draft-festival-activity.model";

const REQUIRED_LOCATION = "Le lieu est nécessaire";

export class ActivitySignaSpecification {
  static errors(section: DraftSignaSection): string[] {
    if (this.hasLocationSet(section)) {
      return [];
    }
    return [REQUIRED_LOCATION];
  }

  private static hasLocationSet(section: DraftSignaSection) {
    return section.location !== null;
  }
}
