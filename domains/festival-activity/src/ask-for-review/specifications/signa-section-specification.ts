import { Draft } from "../../festival-activity";

const REQUIRED_LOCATION = "Le lieu est nécessaire";

export class ActivitySignaSpecification {
  static errors(section: Draft["signa"]): string[] {
    if (this.hasLocationSet(section)) {
      return [];
    }
    return [REQUIRED_LOCATION];
  }

  private static hasLocationSet(section: Draft["signa"]) {
    return section.location !== null;
  }
}
