import {
  BAR,
  MANUTENTION,
  STATIQUE,
} from "@overbookd/festival-event-constants";
import { FullTask } from "./assign-task-to-volunteer";
import { getFactory } from "./task.factory";
import { AssignmentBuilder } from "./assignment.builder";
import { friday08hto09h } from "./assign-task-to-volunteer.test.utils";

const factory = getFactory();

const fulfilledAssignment = AssignmentBuilder.init(friday08hto09h)
  .withAssignees([{ as: "hard" }])
  .withRequestedTeams([{ code: "hard", count: 1 }])
  .build();
export const fullyAssignedTask: FullTask = factory
  .init("Task fully assigned")
  .withAssignments([fulfilledAssignment])
  .build();

const missingOnePlaizirAssignment = AssignmentBuilder.init(friday08hto09h)
  .withRequestedTeams([{ code: "plaizir", count: 1 }])
  .build();
export const missingOnePlaizirTask: FullTask = factory
  .init("Task missing one assignee")
  .withCategory(BAR)
  .withAssignments([missingOnePlaizirAssignment])
  .build();

const missingTwoVieuxAssignment = AssignmentBuilder.init(friday08hto09h)
  .withAssignees([{ as: "hard" }])
  .withRequestedTeams([
    { code: "hard", count: 1 },
    { code: "vieux", count: 2 },
  ])
  .build();
export const missingTwoVieuxTask: FullTask = factory
  .init("Task missing two vieux")
  .withCategory(MANUTENTION)
  .withTopPriority()
  .withAssignments([missingTwoVieuxAssignment])
  .build();

const missingOneHardAndOneBenevoleAssignment = AssignmentBuilder.init(
  friday08hto09h,
)
  .withAssignees([{ as: "hard" }, { as: "hard" }, { as: "benevole" }])
  .withRequestedTeams([
    { code: "hard", count: 3 },
    { code: "benevole", count: 2 },
  ])
  .build();
export const missingOneHardAndOneBenevoleTask: FullTask = factory
  .init("Task missing one hard and one benevole")
  .withCategory(STATIQUE)
  .withAssignments([missingOneHardAndOneBenevoleAssignment])
  .build();

export const missingOneAssigneeThenOneHardAndOneBenevoleTask: FullTask = factory
  .init("Task missing one assignee then one hard and one benevole")
  .withCategory(STATIQUE)
  .withAssignments([
    missingOnePlaizirAssignment,
    missingOneHardAndOneBenevoleAssignment,
  ])
  .build();
