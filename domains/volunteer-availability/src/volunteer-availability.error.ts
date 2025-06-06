import { formatDateNumberValue } from "@overbookd/time";
import { SHIFT_HOURS } from "./shift.constant.js";

export const AVAILABILITY_ERROR_MESSAGES = {
  PERIOD_TIMELINE: "start should be before end",
  START_HOUR: "start should be a pair hour",
  MINIMUM_PERIOD_DURATION: "La disponibilité doit durer au moins 2 heures",
  PERIODS_JOINT: "periods should overlap or follow to be added",
  ODD_HOUR: buildOddHourError(),
};

export class AvailabilityError extends Error {}

export class AvailabilityPeriodTimelineError extends AvailabilityError {
  constructor() {
    super(AVAILABILITY_ERROR_MESSAGES.PERIOD_TIMELINE);
  }
}

export class AvailabilityStartError extends AvailabilityError {
  constructor() {
    super(AVAILABILITY_ERROR_MESSAGES.START_HOUR);
  }
}

export class AvailabilityMinimumPeriodDurationError extends AvailabilityError {
  constructor() {
    super(AVAILABILITY_ERROR_MESSAGES.MINIMUM_PERIOD_DURATION);
  }
}

export class AvailabilityPeriodsJointError extends AvailabilityError {
  constructor() {
    super(AVAILABILITY_ERROR_MESSAGES.PERIODS_JOINT);
  }
}

function buildOddHourError() {
  const startShift = displayHour(SHIFT_HOURS.PARTY);
  const endShift = displayHour(SHIFT_HOURS.NIGHT);
  const shift = `${startShift}-${endShift}`;

  return `Il n'est pas possible de sélectionner des heures impaires en dehors du shift de la soirée (${shift})`;
}

function displayHour(hour: number) {
  return `${formatDateNumberValue(hour)}h00`;
}
