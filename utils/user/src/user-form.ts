export type UserUpdateForm = {
  firstname?: string;
  lastname?: string;
  nickname?: string | null;
  email?: string;
  birthdate?: Date;
  phone?: string;
  comment?: string | null;
  profilePicture?: string;
  note?: string | null;
};
