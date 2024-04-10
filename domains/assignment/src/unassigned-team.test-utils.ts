import { Assignment, Task } from "./unassigned-team";

const assignmentFulfilled: Assignment = {
  assignees: [{ as: "hard" }],
  requestedTeams: [{ code: "hard", count: 1 }],
};
export const taskFullyAssigned: Task = {
  assignments: [assignmentFulfilled],
};

const assignmentMissingOneAssignee: Assignment = {
  assignees: [],
  requestedTeams: [{ code: "plaizir", count: 1 }],
};
export const taskMissingOneAssignee: Task = {
  assignments: [assignmentMissingOneAssignee],
};

const assignmentMissingTwoVieux: Assignment = {
  assignees: [{ as: "hard" }],
  requestedTeams: [
    { code: "hard", count: 1 },
    { code: "vieux", count: 2 },
  ],
};
export const taskMissingTwoVieux: Task = {
  assignments: [assignmentMissingTwoVieux],
};

const assignmentMissingOneHardAndOneBenevole: Assignment = {
  assignees: [{ as: "hard" }, { as: "hard" }, { as: "benevole" }],
  requestedTeams: [
    { code: "hard", count: 3 },
    { code: "benevole", count: 2 },
  ],
};
export const taskMissingOneHardAndOneBenevole: Task = {
  assignments: [assignmentMissingOneHardAndOneBenevole],
};

export const taskMissingOneAssigneeThenOneHardAndOneBenevole: Task = {
  assignments: [
    assignmentMissingOneAssignee,
    assignmentMissingOneHardAndOneBenevole,
  ],
};
