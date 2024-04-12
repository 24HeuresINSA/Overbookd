import {
  BAR,
  MANUTENTION,
  STATIQUE,
} from "@overbookd/festival-event-constants";
import {
  Assignment,
  TaskWithAssignments,
  BaseTask,
  MissingAssignmentTask,
} from "./assign-task-to-volunteer";

const assignmentFulfilled: Assignment = {
  assignees: [{ as: "hard" }],
  requestedTeams: [{ code: "hard", count: 1 }],
};
const baseTaskFullyAssigned: BaseTask = {
  id: 1,
  name: "Task fully assigned",
  topPriority: false,
};
export const taskFullyAssigned: TaskWithAssignments = {
  ...baseTaskFullyAssigned,
  assignments: [assignmentFulfilled],
};

const assignmentMissingOneAssignee: Assignment = {
  assignees: [],
  requestedTeams: [{ code: "plaizir", count: 1 }],
};
const baseTaskMissingOneAssignee: BaseTask = {
  id: 2,
  name: "Task missing one assignee",
  topPriority: false,
  category: BAR,
};
export const taskMissingOneAssignee: TaskWithAssignments = {
  ...baseTaskMissingOneAssignee,
  assignments: [assignmentMissingOneAssignee],
};
export const expectedTaskMissingOneAssignee: MissingAssignmentTask = {
  ...baseTaskMissingOneAssignee,
  teams: ["plaizir"],
};

const assignmentMissingTwoVieux: Assignment = {
  assignees: [{ as: "hard" }],
  requestedTeams: [
    { code: "hard", count: 1 },
    { code: "vieux", count: 2 },
  ],
};
const baseMissingTwoVieux: BaseTask = {
  id: 3,
  name: "Task missing two vieux",
  topPriority: false,
  category: MANUTENTION,
};
export const taskMissingTwoVieux: TaskWithAssignments = {
  ...baseMissingTwoVieux,
  assignments: [assignmentMissingTwoVieux],
};
export const expectedTaskMissingTwoVieux: MissingAssignmentTask = {
  ...baseMissingTwoVieux,
  teams: ["vieux"],
};

const assignmentMissingOneHardAndOneBenevole: Assignment = {
  assignees: [{ as: "hard" }, { as: "hard" }, { as: "benevole" }],
  requestedTeams: [
    { code: "hard", count: 3 },
    { code: "benevole", count: 2 },
  ],
};
const baseTaskMissingOneHardAndOneBenevole: BaseTask = {
  id: 4,
  name: "Task missing one hard and one benevole",
  topPriority: false,
  category: STATIQUE,
};
export const taskMissingOneHardAndOneBenevole: TaskWithAssignments = {
  ...baseTaskMissingOneHardAndOneBenevole,
  assignments: [assignmentMissingOneHardAndOneBenevole],
};
export const expectedTaskMissingOneHardAndOneBenevole: MissingAssignmentTask = {
  ...baseTaskMissingOneHardAndOneBenevole,
  teams: ["hard", "benevole"],
};

const baseTaskMissingOneAssigneeThenOneHardAndOneBenevole: BaseTask =
  {
    id: 5,
    name: "Task missing one assignee then one hard and one benevole",
    topPriority: false,
  };
export const taskMissingOneAssigneeThenOneHardAndOneBenevole: TaskWithAssignments = {
  ...baseTaskMissingOneAssigneeThenOneHardAndOneBenevole,
  assignments: [
    assignmentMissingOneAssignee,
    assignmentMissingOneHardAndOneBenevole,
  ],
};
export const expectedTaskMissingOneAssigneeThenOneHardAndOneBenevole: MissingAssignmentTask =
  {
    ...baseTaskMissingOneAssigneeThenOneHardAndOneBenevole,
    teams: ["hard", "benevole", "plaizir"],
  };
