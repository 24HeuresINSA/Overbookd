interface BaseVolunteer {
  id: number;
  firstname: string;
  lastname: string;
  charisma: number;
  comment?: string;
}

export interface Volunteer extends BaseVolunteer {
  teams: string[];
  assignments: number;
}

export interface DatabaseVolunteer extends BaseVolunteer {
  team: {
    team: {
      code: string;
    };
  }[];
  _count?: {
    assignments: number;
  };
}
