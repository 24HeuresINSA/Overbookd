import { IProvidePeriod } from "@overbookd/period";

export type TimelineActivity = {
  id: number;
  name: string;
  team: string;
};

export type TimelineMobilization = IProvidePeriod & {
  assignments: IProvidePeriod[];
};

export type TimelineTask = {
  id: number;
  name: string;
  mobilizations: TimelineMobilization[];
  topPriority: boolean;
};

export type TimelineEvent = {
  activity: TimelineActivity;
  tasks: TimelineTask[];
};
