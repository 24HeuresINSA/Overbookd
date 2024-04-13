import {
  BAR,
  MANUTENTION,
  STATIQUE,
} from "@overbookd/festival-event-constants";
import { FullTask } from "./assign-task-to-volunteer";
import { getFactory } from "./task.factory";
import {
  fulfilledAssignment,
  missingOneHardAndOneBenevoleAssignment,
  missingOnePlaizirAssignment,
  missingTwoVieuxAssignment,
} from "./assign-task-to-volunteer.test.utils";

const factory = getFactory();

export const fullyAssignedTask: FullTask = factory
  .init("Task fully assigned")
  .withAssignments([fulfilledAssignment])
  .build();

export const missingOnePlaizirTask: FullTask = factory
  .init("Task missing one assignee")
  .withCategory(BAR)
  .withAssignments([missingOnePlaizirAssignment])
  .build();

export const missingTwoVieuxTask: FullTask = factory
  .init("Task missing two vieux")
  .withCategory(MANUTENTION)
  .withTopPriority()
  .withAssignments([missingTwoVieuxAssignment])
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
