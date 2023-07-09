import { User } from '@prisma/client';

export type UserWithoutPassword = Omit<User, 'password'>;
export type UserWithTeamAndPermission = UserWithoutPassword & {
  team: string[];
  permissions: string[];
};
export type UserPasswordOnly = Pick<User, 'password'>;
export type MyUserInformation = UserWithTeamAndPermission & {
  tasksCount: number;
};
