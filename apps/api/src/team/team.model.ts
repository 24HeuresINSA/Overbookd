export class Team {
  name: string;
  color: string;
  icon: string;
  code: string;
}

export interface UpdateTeamForm {
  name?: string;
  color?: string;
  icon?: string;
}
