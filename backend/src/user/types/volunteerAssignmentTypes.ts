import { TaskCategory } from '@prisma/client';

export interface DatabaseVolunteerAssignmentStat {
  timeSpan: {
    start: Date;
    end: Date;
    timeWindow: {
      ft: {
        category: TaskCategory;
      };
    };
  };
}
