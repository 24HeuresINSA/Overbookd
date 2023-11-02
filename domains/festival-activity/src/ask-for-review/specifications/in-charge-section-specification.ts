import { Draft } from "../../festival-activity";

const REQUIRED_TEAM = "Une équipe responsable est nécessaire";

export class ActivityInChargeSpecification {
  static errors(section: Draft["inCharge"]): string[] {
    return this.hasTeamSet(section) ? [] : [REQUIRED_TEAM];
  }

  private static hasTeamSet(section: Draft["inCharge"]) {
    return section.team !== null;
  }
}
