export class Team {
  name: string;
  color: string;
  icon: string;
  code: string;
}

export type UpdateTeamForm = {
  name?: string;
  color?: string;
  icon?: string;
};
