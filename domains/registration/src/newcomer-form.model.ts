import { JoinableTeam } from "./enroll";

export interface NewcomerToEnroll {
  id: number;
}

export interface EnrollNewcomersForm {
  newcomers: NewcomerToEnroll[];
  team: JoinableTeam;
}
