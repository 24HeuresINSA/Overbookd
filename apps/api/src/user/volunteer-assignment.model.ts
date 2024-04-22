import { TaskCategory } from "@prisma/client";

export type DatabaseOldVolunteerAssignmentStat = {
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

export type DatabaseVolunteerAssignmentStat = {
  mobilization: {
    start: Date;
    end: Date;
  };
  festivalTask: {
    category: TaskCategory;
  };
};
