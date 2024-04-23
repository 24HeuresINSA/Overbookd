import { IProvidePeriod } from "@overbookd/period";
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

export type DatabaseVolunteerAssignmentStat = IProvidePeriod & {
  festivalTask: { category: TaskCategory };
};
