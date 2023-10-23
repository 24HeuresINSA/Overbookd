import { SignaSection } from "../../creation/draft-festival-activity.model";

const REQUIRED_LOCATION = "Le lieu est nécessaire";
export class ActivitySignaSpecification {
  static errors(section: SignaSection): string[] {
    return section.location !== null ? [] : [REQUIRED_LOCATION];
  }
}
