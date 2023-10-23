import { InChargeSection } from "../../creation/draft-festival-activity.model";

const REQUIRED_TEAM = "Une équipe responsable est nécessaire";

export class ActivityInChargeSpecification {
  static errors(section: InChargeSection): string[] {
    return section.team !== null ? [] : [REQUIRED_TEAM];
  }
}
