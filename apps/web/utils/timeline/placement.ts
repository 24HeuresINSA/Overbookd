import { Period } from "@overbookd/period";
import { getPeriodDuration } from "../models/period";

function getIdleBeforePercent(container: Period, containee: Period): number {
  const containerDuration = getPeriodDuration(container);
  const idleBeforeDuration =
    containee.start.getTime() - container.start.getTime();
  return (idleBeforeDuration / containerDuration) * 100;
}

function getDurationPercent(container: Period, containee: Period): number {
  const containerDuration = getPeriodDuration(container);
  const containeeDuration = getPeriodDuration(containee);
  return (containeeDuration / containerDuration) * 100;
}

export function marginPercent(container: Period, containee: Period): number {
  const durationRatio = getIdleBeforePercent(container, containee);
  return Math.max(durationRatio, 0);
}

export function widthPercent(container: Period, containee: Period) {
  const durationRatio = getDurationPercent(container, containee);
  const margin = marginPercent(container, containee);
  const remainingWidthPercent = 100 - margin;
  return Math.min(durationRatio, remainingWidthPercent);
}
