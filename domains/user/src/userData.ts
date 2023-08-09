export interface UserName {
  firstname: string;
  lastname: string;
}

export interface UserNameWithNickname extends UserName {
  nickname?: string;
}

export interface User extends UserName {
  id: number;
};

export interface UserWithoutPassword extends User {
  firstname: string;
  lastname: string;
  nickname?: string;
  email: string;
  birthdate: Date;
  phone: string;
  comment?: string;
  hasPayedContributions: boolean;
  profilePicture?: string;
  charisma: number;
  balance: number;
};

export interface UserPersonnalData extends UserWithoutPassword {
  teams: string[];
};

export interface UserWithTeamsAndPermissions extends UserPersonnalData {
  permissions: string[];
}

export interface MyUserInformation extends UserPersonnalDataWithPermissions {
  tasksCount: number;
};
