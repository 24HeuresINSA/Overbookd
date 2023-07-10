export interface Task {
  id: number;
  name: string;
  status: TaskStatus;
}

const DRAFT = 'DRAFT';
const SUBMITTED = 'SUBMITTED';
const VALIDATED = 'VALIDATED';
const REFUSED = 'REFUSED';
const READY = 'READY';

export const taskStatuses: Record<TaskStatus, TaskStatus> = {
  DRAFT,
  SUBMITTED,
  VALIDATED,
  REFUSED,
  READY,
};

export type TaskStatus =
  | typeof DRAFT
  | typeof SUBMITTED
  | typeof VALIDATED
  | typeof REFUSED
  | typeof READY;
