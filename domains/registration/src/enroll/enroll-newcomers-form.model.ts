import { JoinableTeam } from ".";
import { NewcomerToEnroll } from "./enroll-newcomers";

export interface EnrollNewcomersForm {
  newcomers: NewcomerToEnroll[];
  team: JoinableTeam;
}
