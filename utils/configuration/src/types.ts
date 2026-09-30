export type Configuration<
  T extends object | string | number | boolean =
    object | string | number | boolean,
> = {
  key: string;
  value: T;
};

export type UsefulLinksConfigValue = {
  googleCalendar?: string;
  slack?: string;
};

export type RegistrationFormConfigValue = {
  isVolunteerRegistrationOpen: boolean;
  volunteerDescription: string;
  staffDescription: string;
};

export type FestivalEventStatConfigValue = {
  code: string;
  count: number;
};
export type FestivalEventStatsConfigValue = {
  activities: FestivalEventStatConfigValue[];
  tasks: FestivalEventStatConfigValue[];
};
