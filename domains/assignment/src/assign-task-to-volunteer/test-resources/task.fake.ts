import {
  BAR,
  FUN,
  MANUTENTION,
  RELOU,
  STATIQUE,
} from "@overbookd/festival-event-constants";
import { getTaskFactory } from "./factory/task.factory.js";
import {
  friday09hto10h,
  friday18hto19h,
  friday18hto20h,
  friday19hto20h,
  friday19hto21h,
  friday20hto21h,
  fulfilledAssignment,
  missingOneHardAndOneBenevoleAssignment,
  missingOnePlaizirAssignment,
  missingTwoVieuxAssignment,
} from "./assign-task-to-volunteer.test.utils.js";

const factory = getTaskFactory();

export const fullyAssignedTask = factory
  .init("Task fully assigned")
  .withAssignments([fulfilledAssignment]);

export const missingOnePlaizirTask = factory
  .init("Task missing one plaizir")
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

export const fulfillAssignmentThenMissingOneHardTask = factory
  .init("Task with fulfilled first assignment then one hard is missing")
  .withCategory(RELOU)
  .withAssignments([
    fulfilledAssignment.during(friday18hto19h).withMobilization(friday18hto20h),
    fulfilledAssignment
      .withAssignees([])
      .during(friday19hto20h)
      .withMobilization(friday18hto20h),
  ]);

export const missingTwoVieuxDuring19hto20h = missingTwoVieuxAssignment
  .during(friday19hto20h)
  .withMobilization(friday19hto21h);

export const missingOnePlaizirOrTwoVieuxOnStaggeredAssignmentsTask = factory
  .init("Task missing one plaizir or two vieux on staggered assignments")
  .withCategory(FUN)
  .withAssignments([
    missingOnePlaizirAssignment
      .during(friday18hto19h)
      .withMobilization(friday18hto20h),
    missingOnePlaizirAssignment
      .during(friday19hto20h)
      .withMobilization(friday18hto20h),
    missingTwoVieuxDuring19hto20h,
    missingTwoVieuxAssignment
      .during(friday20hto21h)
      .withMobilization(friday19hto21h),
  ]);
