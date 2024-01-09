import { FestivalActivity } from "../../festival-activity";

const REQUIRED_LOCATION = "Le lieu est nécessaire";

export class ActivitySignaSpecification {
  static errors(section: FestivalActivity["signa"]): string[] {
    if (this.hasLocationSet(section)) {
      return [];
    }
    return [REQUIRED_LOCATION];
  }

  private static hasLocationSet(section: FestivalActivity["signa"]) {
    return section.location !== null;
  }
}
