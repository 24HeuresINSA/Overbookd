export type UserWithoutPassword = {
  firstname: string;
  lastname: string;
  nickname: string | null;
  id: number;
  email: string;
  birthdate: Date;
  phone: string;
  comment: string | null;
  hasPayedContributions: boolean;
  profilePicture: string | null;
  charisma: number;
  balance: number;
};

type WithTeams = {
  teams: string[];
};

type WithPermissions = {
  permissions: string[];
};

export type UserPersonnalData = UserWithoutPassword & WithTeams;

export type UserWithTeamsAndPermissions = UserWithoutPassword &
  WithTeams &
  WithPermissions;

export type UserPasswordOnly = {
  password: string;
};
export type MyUserInformation = UserWithTeamsAndPermissions & {
  tasksCount: number;
};
