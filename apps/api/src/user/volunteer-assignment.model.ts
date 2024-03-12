import { TaskCategory } from "@prisma/client";

export type DatabaseVolunteerAssignmentStat = {
  timeSpan: {
    start: Date;
    end: Date;
    timeWindow: {
      ft: {
        category: TaskCategory;
      };
    };
  };
};
