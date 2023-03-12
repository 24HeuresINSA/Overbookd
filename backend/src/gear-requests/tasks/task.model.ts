export interface Task {
  id: number;
  name: string;
  status: TaskStatus;
}

export const taskStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  VALIDATED: 'VALIDATED',
  REFUSED: 'REFUSED',
  READY: 'READY',
};

export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];
