import { TaskCategory } from '@prisma/client';

export interface DatabaseVolunteerAssignmentStat {
  timespan: {
    start: Date;
    end: Date;
    timeWindow: {
      ft: {
        category: TaskCategory;
      };
    };
  };
}
