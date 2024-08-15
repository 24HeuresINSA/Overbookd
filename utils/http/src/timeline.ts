import { IProvidePeriod } from "@overbookd/time";

export type TimelineActivity = {
  id: number;
  name: string;
  team: string;
};

export type TimelineAssignee = {
  firstname: string;
  lastname: string;
  teams: string[];
  as?: string;
  phone: string;
};

export type TimelineAssignment = IProvidePeriod & {
  assignees: TimelineAssignee[];
};

export type TimelineMobilization = IProvidePeriod & {
  assignments: TimelineAssignment[];
};

export type TimelineTask = {
  id: number;
  name: string;
  appointment: string;
  mobilizations: TimelineMobilization[];
  topPriority: boolean;
};

export type TimelineEvent = {
  activity: TimelineActivity;
  tasks: TimelineTask[];
};
