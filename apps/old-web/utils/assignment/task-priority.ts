export const TaskPriorities = {
  PRIORITAIRE: "PRIORITAIRE",
  NON_PRIORITAIRE: "NON PRIORITAIRE",
};

export type TaskPriority = keyof typeof TaskPriorities;
