export type BaseVolunteer = {
  id: number;
  firstname: string;
  lastname: string;
  charisma: number;
  comment?: string;
};

export type Volunteer = BaseVolunteer & {
  teams: string[];
  assignmentDuration: number;
};
