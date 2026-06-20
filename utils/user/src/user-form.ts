export type UserUpdateForm = {
  firstName?: string;
  lastName?: string;
  nickname?: string | null;
  email?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  comment?: string | null;
  profilePicture?: string;
  note?: string | null;
};
