import { Assignment, Task } from "./unassigned-team";

const assignmentWithoutUnassigned: Assignment = {
  assignees: [{ as: "hard" }],
  requestedTeams: [{ code: "hard", count: 1 }],
};
export const taskWithoutUnassigned: Task = {
  assignments: [assignmentWithoutUnassigned],
};

const assignmentWithOneUnassigned: Assignment = {
  assignees: [],
  requestedTeams: [{ code: "plaizir", count: 1 }],
};
export const taskWithOneUnassigned: Task = {
  assignments: [assignmentWithOneUnassigned],
};

const assignmentWithOneUnassignedAmongTwoTeams: Assignment = {
  assignees: [{ as: "hard" }],
  requestedTeams: [
    { code: "hard", count: 1 },
    { code: "vieux", count: 2 },
  ],
};
export const taskWithOneUnassignedAmongTwoTeams: Task = {
  assignments: [assignmentWithOneUnassignedAmongTwoTeams],
};

const assignmentWithTwoDifferentUnassigned: Assignment = {
  assignees: [{ as: "hard" }, { as: "hard" }, { as: "benevole" }],
  requestedTeams: [
    { code: "hard", count: 3 },
    { code: "benevole", count: 2 },
  ],
};
export const taskWithTwoDifferentUnassigned: Task = {
  assignments: [assignmentWithTwoDifferentUnassigned],
};

export const taskWithTwoAssignments: Task = {
  assignments: [
    assignmentWithOneUnassigned,
    assignmentWithTwoDifferentUnassigned,
  ],
};
