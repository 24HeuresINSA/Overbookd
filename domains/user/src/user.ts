export type UserName = {
  firstname: string;
  lastname: string;
}

export type UserNameWithNickname = UserName & {
  nickname?: string;
}

export type User = UserName & {
  id: number;
};

export type UserCreationForm = UserNameWithNickname & {
  teamId?: number;
  email: string;
  birthdate: Date;
  phone: string;
  comment?: string;
  password: string;
};

export type UserUpdateForm = UserName & {
  nickname?: string | null;
  email?: string;
  birthdate?: Date;
  phone?: string;
  comment?: string | null;
  hasPayedContributions?: boolean;
  profilePicture?: string | null;
  charisma?: number;
};

export type UserPersonnalData = User & {
  nickname?: string;
  email?: string;
  birthdate?: Date;
  phone?: string;
  comment?: string;
  hasPayedContributions?: boolean;
  profilePicture?: string;
  charisma: number;
  balance: number;
  teams: string[];
};

export type UserPersonnalDataWithPermissions = UserPersonnalData & {
  permissions: string[];
}

export type MyUserInformation = UserPersonnalDataWithPermissions & {
  tasksCount: number;
};
