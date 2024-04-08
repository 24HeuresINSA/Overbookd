import { Category } from "@overbookd/festival-event-constants";

export type TaskWithRequestedTeams = {
  id: number;
  name: string;
  topPriority: boolean;
  category: Category;
  teams: string[];
};
