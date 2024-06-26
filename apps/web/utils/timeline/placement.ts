import { type IProvidePeriod, Period } from "@overbookd/period";

function getIdleBeforePercent(
  container: IProvidePeriod,
  containee: IProvidePeriod,
): number {
  const containerDuration = Period.init(container).duration.inMilliseconds;
  const idleBeforeDuration =
    containee.start.getTime() - container.start.getTime();
  return (idleBeforeDuration / containerDuration) * 100;
}

function getDurationPercent(
  container: IProvidePeriod,
  containee: IProvidePeriod,
): number {
  const containerDuration = Period.init(container).duration.inMilliseconds;
  const containeeDuration = Period.init(containee).duration.inMilliseconds;
  return (containeeDuration / containerDuration) * 100;
}

export function marginPercent(
  container: IProvidePeriod,
  containee: IProvidePeriod,
): number {
  const durationRatio = getIdleBeforePercent(container, containee);
  return Math.max(durationRatio, 0);
}

export function widthPercent(
  container: IProvidePeriod,
  containee: IProvidePeriod,
) {
  const durationRatio = getDurationPercent(container, containee);
  const margin = marginPercent(container, containee);
  const remainingWidthPercent = 100 - margin;
  return Math.min(durationRatio, remainingWidthPercent);
}
