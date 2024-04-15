import {
  BAR,
  MANUTENTION,
  STATIQUE,
} from "@overbookd/festival-event-constants";
import { getTaskFactory } from "./factory/task.factory";
import {
  friday09hto10h,
  fulfilledAssignment,
  missingOneHardAndOneBenevoleAssignment,
  missingOnePlaizirAssignment,
  missingTwoVieuxAssignment,
} from "./assign-task-to-volunteer.test.utils";

const factory = getTaskFactory();

export const fullyAssignedTask = factory
  .init("Task fully assigned")
  .withAssignments([fulfilledAssignment]);

export const missingOnePlaizirTask = factory
  .init("Task missing one assignee")
  .withCategory(BAR)
  .withAssignments([
    missingOnePlaizirAssignment,
    missingOnePlaizirAssignment.during(friday09hto10h),
  ]);

export const missingTwoVieuxTask = factory
  .init("Task missing two vieux")
  .withCategory(MANUTENTION)
  .withTopPriority()
  .withAssignments([missingTwoVieuxAssignment]);

export const missingOneHardAndOneBenevoleTask = factory
  .init("Task missing one hard and one benevole")
  .withCategory(STATIQUE)
  .withAssignments([missingOneHardAndOneBenevoleAssignment]);

export const missingOneAssigneeThenOneHardAndOneBenevoleTask = factory
  .init("Task missing one assignee then one hard and one benevole")
  .withCategory(STATIQUE)
  .withAssignments([
    missingOnePlaizirAssignment,
    missingOneHardAndOneBenevoleAssignment,
  ]);
