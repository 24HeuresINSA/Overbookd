import { Category } from "@overbookd/festival-event-constants";

export type TaskIdentifier = {
  id: number;
  name: string;
};
export type TaskCategorized = TaskIdentifier & {
  topPriority: boolean;
  category?: Category;
};
