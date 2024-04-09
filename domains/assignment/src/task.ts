import { Category } from "@overbookd/festival-event-constants";

export type TaskWithUnassignedTeams = {
  id: number;
  name: string;
  topPriority: boolean;
  category?: Category;
  teams: string[];
};
