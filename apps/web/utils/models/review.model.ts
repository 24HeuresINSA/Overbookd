import { Team } from "./team.model";

export interface Review {
  team: Team;
  status: ReviewStatus;
}

export enum ReviewStatus {
  VALIDATED = "VALIDATED",
  REFUSED = "REFUSED",
}

export interface Reviewer {
  teamCode: string;
}
