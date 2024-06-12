import { JoinableTeam } from "./joinable-team.js";
import { NewcomerToEnroll } from "./enroll-newcomers.js";

export type EnrollNewcomersForm = {
  newcomers: NewcomerToEnroll[];
  team: JoinableTeam;
};
