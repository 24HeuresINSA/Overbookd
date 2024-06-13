import type { MyUserInformation, UserPersonalData } from "@overbookd/user";
import type { DisplayableCategory } from "../assignment/task-category";

type WithPotentialProfilePicture = {
  profilePicture?: string;
  profilePictureBlob?: string;
};

export type UserPersonalDataWithProfilePicture = UserPersonalData &
  WithPotentialProfilePicture;

export type MyUserInformationWithProfilePicture = MyUserInformation &
  WithPotentialProfilePicture;

export type DisplayableAssignmentStat = {
  category: DisplayableCategory;
  duration: number;
};

export type UserDataWithPotentialyProfilePicture =
  | UserPersonalData
  | UserPersonalDataWithProfilePicture;
