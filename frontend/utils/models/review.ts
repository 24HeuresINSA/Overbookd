import { Team } from "./team";

export interface Review {
  team: Team;
  status: ReviewStatus;
}

export enum ReviewStatus {
  VALIDATED = "VALIDATED",
  REFUSED = "REFUSED",
}
