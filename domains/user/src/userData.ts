export interface UserName {
  firstname: string;
  lastname: string;
  nickname?: string;
}

export interface User extends UserName {
  id: number;
};

export interface UserPersonnalData extends User {
  email: string;
  birthdate: Date;
  phone: string;
  comment?: string;
  hasPayedContributions: boolean;
  profilePicture?: string;
  charisma: number;
  balance: number;
  teams: string[];
};

export interface MyUserInformation extends UserPersonnalData {
  permissions: string[];
  tasksCount: number;
};
