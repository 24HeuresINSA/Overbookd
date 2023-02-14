export const AVAILABILITY_ERROR_MESSAGES = {
  PERIOD_TIMELINE: "start should be before end",
  START_HOUR: "start should be a pair hour",
  MINIMUM_PERIOD_DURATION: "period should last at least 2 hours",
  PERIODS_JOINT: "periods should overlap or follow to be added",
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
