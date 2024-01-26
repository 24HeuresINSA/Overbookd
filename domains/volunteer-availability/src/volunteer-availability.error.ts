import { SHIFT_HOURS } from "./shift.constant";

export const AVAILABILITY_ERROR_MESSAGES = {
  PERIOD_TIMELINE: "start should be before end",
  START_HOUR: "start should be a pair hour",
  MINIMUM_PERIOD_DURATION: "period should last at least 2 hours",
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

export class AvailabilityDateOddHourError extends AvailabilityError {
  constructor() {
    super(AVAILABILITY_ERROR_MESSAGES.ODD_HOUR);
  }
}

function buildOddHourError() {
  const startShift = displayHour(SHIFT_HOURS.PARTY);
  const endShift = displayHour(SHIFT_HOURS.NIGHT);
  const shift = `${startShift}-${endShift}`;

  return `❌ Il n'est pas possible de sélectionner des heures impaires en dehors du shift de la soirée (${shift})`;
}

function displayHour(hour: number) {
  return `${hour.toString().padStart(2, "0")}h00`;
}
