import { FestivalActivity } from "../../festival-activity";

const REQUIRED_TEAM = "Une équipe responsable est nécessaire";

export class ActivityInChargeSpecification {
  static errors(section: FestivalActivity["inCharge"]): string[] {
    return this.hasTeamSet(section) ? [] : [REQUIRED_TEAM];
  }

  private static hasTeamSet(section: FestivalActivity["inCharge"]) {
    return section.team !== null;
  }
}
