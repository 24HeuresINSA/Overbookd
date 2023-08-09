export type UserCreateForm = {
  firstname: string;
  lastname: string;
  nickname?: string | null;
  teamId?: number;
  email: string;
  birthdate: Date;
  phone: string;
  comment?: string | null;
  password: string;
};

export type UserUpdateForm = {
  firstname?: string;
  lastname?: string;
  nickname?: string | null;
  email?: string;
  birthdate?: Date;
  phone?: string;
  comment?: string | null;
  hasPayedContributions?: boolean;
  profilePicture?: string | null;
  charisma?: number;
};

type WithTeams = {
  teams: string[];
};

type WithPermissions = {
  permissions: string[];
};

export type UserPersonnalData = UserUpdateForm & WithTeams;

export type UserWithTeamsAndPermissions = UserUpdateForm &
  WithTeams &
  WithPermissions;

export type UserPasswordOnly = {
  password: string;
};

export type MyUserInformation = UserWithTeamsAndPermissions & {
  tasksCount: number;
};
