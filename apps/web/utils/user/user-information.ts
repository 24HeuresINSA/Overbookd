import type { MyUserInformation, UserPersonalData } from "@overbookd/user";
import type { DisplayableCategory } from "../assignment/task-category";

type WithPotentialProfilePicture = {
  profilePicture?: string;
  profilePictureBlob?: string;
};

export type MyUserInformationWithPotentialyProfilePicture = MyUserInformation &
  WithPotentialProfilePicture;

export type DisplayableAssignmentStat = {
  category: DisplayableCategory;
  duration: number;
};

export type UserDataWithPotentialyProfilePicture = UserPersonalData &
  WithPotentialProfilePicture;
