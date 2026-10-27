export const TaskPriorities = {
  PRIORITAIRE: "PRIORITAIRE",
  NON_PRIORITAIRE: "NON PRIORITAIRE",
};

export type TaskPriority = (typeof TaskPriorities)[keyof typeof TaskPriorities];
