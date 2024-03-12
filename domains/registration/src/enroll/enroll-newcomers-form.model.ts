import { JoinableTeam } from ".";
import { NewcomerToEnroll } from "./enroll-newcomers";

export type EnrollNewcomersForm = {
  newcomers: NewcomerToEnroll[];
  team: JoinableTeam;
};
